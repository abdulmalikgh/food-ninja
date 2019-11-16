if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then( (reg) => { console.log('Service Worker registered',reg)})
      .catch( (error) => { console.log("Service Worker could'nt registered : ", error)});
}