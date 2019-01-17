import { Component, NgZone } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    private backgroundGeolocation: any;
    private state: { running: any, locations: any[], region: any } = { running: false, locations: [], region: null };

    constructor(public navCtrl: NavController, public platform: Platform, private zone: NgZone) {
        this.platform.ready().then(() => {
            this.backgroundGeolocation = (<any>window).BackgroundGeolocation;
            this.testBackGeo();
        });
    }

    public get region(): string {
        return JSON.stringify(this.state.region);
    }

    public locationString(loc): string {
        return new Date(loc.time).toLocaleTimeString('en-US') + ' -- ' + JSON.stringify(loc);
    }

    public clearList(): void {
        this.state.locations = [];
    }

    public testBackGeo(): void {
        this.backgroundGeolocation.configure({
            desiredAccuracy: 0,
            distanceFilter: 0,
            stationaryRadius: 0,

            activityType: 'Fitness',

            postTemplate: {
                latitude: '@latitude',
                longitude: '@longitude',
                time: '@time'
            }
        });

        this.backgroundGeolocation.on('start', () => {
            // service started successfully
            // you should adjust your app UI for example change switch element to indicate
            // that service is running
            console.log('[DEBUG] BackgroundGeolocation has been started');
            this.state.running = true;
        });

        this.backgroundGeolocation.on('stop', () => {
            console.log('[DEBUG] BackgroundGeolocation has been stopped');
            this.state.running = false;
        });

        this.backgroundGeolocation.on('location', location => {
            location.event = 'location';
            this.storeLocation(location);
        });

        this.backgroundGeolocation.on('stationary', location => {
            location.event = 'stationary';
            this.storeLocation(location);
        });

        this.backgroundGeolocation.start();
    }

    private storeLocation(location): void {
        console.log('[DEBUG] BackgroundGeolocation location', location);
        this.backgroundGeolocation.startTask(taskKey => {
            this.zone.run(() => {
                const longitudeDelta = 0.01;
                const latitudeDelta = 0.01;
                const region = Object.assign({}, location, {
                    latitudeDelta,
                    longitudeDelta
                });
                const locations = this.state.locations;
                locations.push(location);
                this.state.locations = locations;
                this.state.region = region;

                console.log('>>>> Updated location:  ' + this.locationString(location));
                this.backgroundGeolocation.endTask(taskKey);
            });
        });
    }

}
