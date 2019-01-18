# Sample Ionic App with Background Geolocation Issue
This sample app reproduces [this issue](https://github.com/mauron85/cordova-plugin-background-geolocation/issues/524)  using the `cordova-plugin-mauron85-background-geolocation@3.0.0-alpha.50` plugin.


## Getting Started
- Pull down this repo
- `npm i`
- `ionic cordova build ios`
- Run app on an iOS device using xCode

## Testing Issue
### When In Use permission
- When prompted for Location permissions, choose `Only While Using the App`
- Put the app in the background by pressing the home button
- The blue notification bar will appear in status bar
- Location will be tracked for less than minute and then stop
- This can be confirmed by opening the app again and seeing the tracked locations along with the timestamps

### Always permission
When prompted for Location permissions, choose `Always Allow`
- Put the app in the background by pressing the home button
- The blue notification bar will NOT appear in status bar
- Location will be coninuously tracked but only when the device is in motion
- This can be confirmed by opening the app again and seeing the tracked locations along with the timestamps

## Expected Behavior
The app should show the blue notification banner for both permissions and track background geolocation at a regular interval