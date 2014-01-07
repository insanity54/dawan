module.exports = function(grunt) {

    // Project config.
    grunt.initConfig({
        nunjucks: {
            options: {
                // Task-specific options go here.
            },
            precompile: {
                src: ['./public/js/apps/wan/templates/*',
                      './public/js/apps/account/templates/*'],
                dest: './build/main.js'
            }
        }
    });

    // Load grunt plugins
    grunt.loadNpmTasks('grunt-nunjucks');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default tasks.
    grunt.registerTask('default', function() { console.log('hello grunt')});

    grunt.registerTask('taco', ['nunjucks']);

    
};