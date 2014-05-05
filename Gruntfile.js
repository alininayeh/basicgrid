module.exports = function(grunt) {

    var


        //  Options for Uglify
        //  ############################################################################################################

        //  file to compress and mangle (changed variable and function names) by Uglify
        source_js_files = [
            'assets/js/src/BasicGrid.js',
        ],

        // path where to write the compressed file
        destination_js_file = 'assets/js/BasicGrid.min.js',




        //  Options for Watch
        //  ############################################################################################################

        watch_files = {

            // js files that need to be watched, can also be an array of specific files
            'js': ['assets/js/src/**/*.js'],
               
        };

    grunt.initConfig({

        // load packages.json
        pkg: grunt.file.readJSON('package.json'),




        //  # ##############################################################################
        //  # # UGLIFY - COMPRESSES AND MERGES JAVASCRIPT FILES USING UGLIFYJS
        //  # # For configuration options see https://npmjs.org/package/grunt-contrib-uglify
        //  # ##############################################################################

        'uglify': {
            build: {
                src: source_js_files,
                dest: destination_js_file
            }
        },




        //  # ##############################################################################
        //  # # WATCH - RUN PREDEFINED TASKS WHENEVER WATCHED FILE PATTERNS ARE ADDED, CHANGED OR DELETED
        //  # # For configuration options see https://npmjs.org/package/grunt-contrib-watch
        //  # ##############################################################################

        'watch': {
            'js': {
                files: watch_files['js'],
                tasks: ['uglify'],
                options: {
                    livereload: true
                }
            }
        }

    });

    // register plugins
    
    grunt.loadNpmTasks('grunt-contrib-uglify');     // uglify

    grunt.loadNpmTasks('grunt-contrib-watch');      // monitor file changes and compile them right away

    // register tasks
    // in the array can be added any task that we want to run when writing "grunt" into the console
    // (example: grunt.registerTask('default', ['uglify', 'sass', 'imagemin', 'jshint']); )

    var tasks = [];

    tasks.push('uglify');
    
    grunt.registerTask('build', tasks);

    grunt.registerTask('default', ['watch']); 
};