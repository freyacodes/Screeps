module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');
    grunt.loadNpmTasks('grunt-contrib-watch');
    var credentials = grunt.file.readJSON('credentials.json');

    grunt.initConfig({
        screeps: {
            options: {
                email: credentials.email,
                password: credentials.password,
                branch: 'v1.2',
                ptr: false
            },
            dist: {
                src: ['dist/*.js']
            }
        },
        watch: {
          scripts: {
          	files: ['dist/*.js'],
            tasks: ['screeps']
          },
        }
    });
}