module.exports = function(grunt) {

    // Project config.
    grunt.initConfig({
//        nunjucks: {
//            options: {
                // Task-specific options go here.
//            },
//            precompile: {
//                src: ['./public/js/apps/wan/templates/*',
//                      './public/js/apps/account/templates/*'],
//                dest: './public/build/main.js'
//            }
//        },

        requirejs: {
            js: {
                options: {
                    baseUrl: "public/js",
                    mainConfigFile: "public/js/main.js",
                    name: 'main',
                    out: "public/build/main.js"
                }
            },
            css: {
                options: {
                    baseUrl: 'public/css',
                    cssIn: "public/css/main.css",
                    out: "public/build/main.css",
                    cssImportIgnore: null,
                    optimizeCss: 'default'
                }
            }
        }
    });

    // Load grunt plugins
    grunt.loadNpmTasks('grunt-nunjucks');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    
    // Default tasks.
    grunt.registerTask('default', function() { console.log('hello grunt')});

//    grunt.registerTask('taco', ['nunjucks']);
    grunt.registerTask('precompile', ['requirejs']);

};