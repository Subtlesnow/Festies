// import Vue from 'vue'
// import VueFire from 'vuefire'
// import App from './App'
// Vue.use(VueFire)

(function () {

  function init() {

    let pubNubSettings = {
      channels: ['mychannel']
    };

    pubNubSettings.history = {
      channel: pubNubSettings[0],
      count: 20
    };

    let pubnub = new PubNub({
      publishKey: 'demo',
      subscribeKey: 'demo'
    });

    let states = {
      name: '',
      msgs: [],
      userName: '',
      email: '',
      password: '',
      fullName: '',
      eventLoc: ''
    };


    function initPubNub () {
      pubnub.addListener({
        message: function(data) {
          let type = data.message.name == states.name ? 'sent' : 'received';
          let name = type == 'sent' ? states.name : data.message.name;
          states.msgs.push({name:name, text: data.message.text, type:type});
        }
      });

      pubnub.subscribe({
        channels: pubNubSettings.channels,
      });

      pubnub.history(pubNubSettings.history, function(status, response) {
        console.log(status)
        let history = response.messages;
        for(var i = 0; i < history.length; i++) {
          var type = history[i].entry.name == states.name ? 'send' : 'received';
          states.msgs.push({
            name: history[i].entry.name,
            text: history[i].entry.text,
            type: type
          });
        }
      });
    };

    // Init F7 Vue Plugin
    Vue.use(Framework7Vue)

    // import Vue from 'vue'
    // import VueFire from 'vuefire'
    // import App from './App'
    // Vue.use(VueFire)

    // Init Page Components
    Vue.component('page-about', {
      template: '#page-about',
      data: function () {
        return states;
      },
      methods: {

        onSend: function(text, clear) {
          if(text.trim().length === 0) return;
          pubnub.publish({
            channel: pubNubSettings.channels[0],
            messages: {
              text: text,
              name: this.name
            }
          });
          if(typeof clear == 'function') clear();
        }
      }
    });

    Vue.component('page-form', {
      template: '#page-form',
      // data () {
      //   userName: '',
      //   password: '',
      //   fullName: '',
      //   email: ''
      // }

    });

    Vue.component('page-dynamic-routing', {
      template: '#page-dynamic-routing'
    });

    Vue.component('pictures', {
      template: '#pictures'
    });

    // import Vue from 'vue'
    // import VueFire from 'vuefire'
    // import App from './App'
    // Vue.use(VueFire)

    // Init App
    new Vue({
      el: '#app',
      data: function () {
        return states;
      },
      methods: {
        enterChat: function () {
          console.log(states)
          if(this.name.trim().length === 0) {
            alert("Please enter your name");
            return false;
          }
          this.msgs.length = 0;
          this.$f7.mainView.router.load({url:"/about/"});
          initPubNub();
        },
        addData: function () {

        },
      },
      // Init Framework7 by passing parameters here
      framework7: {
        root: '#app',
        /* Uncomment to enable Material theme: */
        // material: true,
        routes: [
          {
            path: '/about/',
            component: 'page-about'
          },
          {
            path: '/page-form/',
            component: 'page-form'
          },
          {
            path: '/pictures/',
            component: 'pictures'
          },
          {
            path: '/dynamic-route/blog/:blogId/post/:postId/',
            component: 'page-dynamic-routing'
          }
        ],
      }
    });

  }

  // Handle device ready event
  // Note: You may want to check out the vue-cordova package on npm for cordova specific handling with vue - https://www.npmjs.com/package/vue-cordova
  document.addEventListener('deviceready', init, () => {
    console.log("DEVICE IS READY!");
  }, false)

})();
