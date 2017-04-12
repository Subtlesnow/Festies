
(function () {

  function init() {

    let pubnub = new PubNub({
      publishKey: 'pub-c-418abb4a-5912-4014-a14c-8cc4d27c5534',
      subscribeKey: 'sub-c-3529421e-1e0d-11e7-aca9-02ee2ddab7fe'
    });

    let states = {
      name: '',
      msgs: [],
      userName: '',
      email: '',
      password: '',
      fullName: '',
      eventLoc: '',
      showSignIn: false
    };


    function initPubNub () {

      pubnub.addListener({
        message: function(message){

              let type = message.message.name == states.name ? 'sent' : 'received';
              let name = type == 'sent' ? states.name : message.message.name;
              states.msgs.push({name:name, text: message.message.text, type:type});

        console.log(message)
      }
    })

    pubnub.subscribe({
      channels: ['Festies']
    });

    };

    // Init F7 Vue Plugin
    Vue.use(Framework7Vue)


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
            message: {
              text: text,
              name: this.name
        },
          channel: 'Festies'
        });

          if(typeof clear == 'function') clear();
        },

      }
    });

    Vue.component('page-form', {
      template: '#page-form',
      // data () ,
      // addUser: function() {
      //   states.push({
      //     userName: '',
      //     password: '',
      //     fullName: '',
      //     email: ''
      //   })
      // }

    });

    Vue.component('page-dynamic-routing', {
      template: '#page-dynamic-routing'
    });

    Vue.component('pictures', {
      template: '#pictures'
    });


    // Init App
    new Vue({
      el: '#app',
      data: function () {
        return states;
      },
      methods: {
        showMain: function() {
          this.showSignIn = true
        },
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
        addUser: function() {
          console.log(states)
          this.showMain()
        },

        // camera stuff
        initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
          onDeviceReady: function() {
            this.receivedEvent('deviceready')
            console.log("Camera")
          },
          // end of camera stuff

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

  // Camera stuff
  document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
    console.log(navigator.camera);
  }



})();
