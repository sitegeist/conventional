const cbt = require('cbt_tunnels');
const os = require('os');

module.exports = function (command, workingDir, config) {
    if (!process.env.CBT_USERNAME || !process.env.CBT_AUTHKEY) {
        console.error('CrossBrowserTesting Error: You need to specify credentials in your environment variables');
        console.error('  CBT_TUNNELNAME=' + os.userInfo().username);
        console.error('  CBT_USERNAME=myaccount@example.com');
        console.error('  CBT_AUTHKEY=abcdef123456789');
        return;
    }

    cbt.start({
        username: process.env.CBT_USERNAME,
        authkey: process.env.CBT_AUTHKEY,
        tunnelname: process.env.CBT_TUNNELNAME,
        bypass: false
    }, function (err) {
        if (err) {
            console.error('CrossBrowserTesting Error: ', err);
        }
    });
};