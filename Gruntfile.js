'use strict';

module.exports = function (grunt) {

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    RegExp.quote = function (string) {
        return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    // Configurable paths for the app
    var appConfig = {
        app: 'app',
        dist: 'public',
        build: 'build',
        debug: {
            port: 5000
        },
        livePort: 13431
    };

    // Project configuration.
    grunt.initConfig({

        // Project settings
        theme: appConfig,

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
            ' * <%= pkg.description %> v<%= pkg.version %>\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under the <%= pkg.license %> license\n' +
            ' */\n',

        /**
         * Task configuration.
         */
        // Clean dist folder
        clean: {
            build: '<%= theme.build %>',
            public_files: [
                '<%= theme.dist %>'
            ]
        },

        copy: {
            pro: {
                files: [
                    {   // copy lib css
                        expand: true,
                        flatten: true,
                        cwd: 'node_modules',
                        dest: '<%= theme.build %>/css/',
                        src: [
                            'bootstrap/dist/css/bootstrap.css',
                            'jquery-confirm/css/jquery-confirm.css'
                        ]
                    },
                    {   // copy lib js
                        expand: true,
                        flatten: true,
                        cwd: 'node_modules',
                        dest: '<%= theme.build %>/js/',
                        src: [
                            'bootstrap/dist/js/bootstrap.js',
                            'jquery/dist/jquery.js',
                            'jquery-confirm/js/jquery-confirm.js',
                            'socket.io-client/dist/socket.io.js'
                        ]
                    },
                    {   // copy fonts
                        expand: true,
                        flatten: true,
                        cwd: 'node_modules',
                        dest: '<%= theme.dist %>/fonts',
                        src: [
                            'bootstrap/fonts/*'
                        ]
                    }
                ]
            }
        },

        sass: {
            dist: {
                options: {
                    sourcemap: 'none',
                    style: 'expanded' // expanded
                },
                files: {
                    '<%= theme.build %>/css/style.css': '<%= theme.app %>/scss/*.scss'
                }
            }
        },

        cssmin: {
            options: {
                specialComments: 0
            },
            pro: {
                dest: '<%= theme.dist %>/css/core.min.css',
                src: [
                    '<%= theme.build %>/css/bootstrap.css',
                    '<%= theme.build %>/css/jquery-confirm.css',
                    '<%= theme.build %>/css/style.css'
                ]
            },
            dev: {
                dest: '<%= theme.dist %>/css/core.min.css',
                src: [
                    '<%= theme.build %>/css/bootstrap.css',
                    '<%= theme.build %>/css/jquery-confirm.css'
                ]
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>',
                compress: {
                    warnings: false
                },
                report: 'min',
                mangle: true
            },
            pro: {
                files: {
                    '<%= theme.dist %>/js/core.min.js': [
                        '<%= theme.build %>/js/jquery.js',
                        '<%= theme.build %>/js/bootstrap.js',
                        '<%= theme.build %>/js/jquery-confirm.js',
                        '<%= theme.build %>/js/socket.io.js',
                        '<%= theme.app %>/js/chat.js'
                    ]
                }
            },
            dev: {
                files: {
                    '<%= theme.dist %>/js/core.min.js': [
                        '<%= theme.build %>/js/jquery.js',
                        '<%= theme.build %>/js/bootstrap.js',
                        '<%= theme.build %>/js/jquery-confirm.js',
                        '<%= theme.build %>/js/socket.io.js'
                    ]
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '<%= theme.app %>/rc/.jshintrc'
            },
            assets: {
                src: [
                    '<%= theme.app %>/js/chat.js'
                ]
            }
        },

        // Watch for changes in live edit
        watch: {
            options: {
                livereload: '<%= theme.livePort %>'
            },
            css: {
                files: [
                    '<%= theme.build %>/css/style.css'
                ]
            },
            sass: {
                files: [
                    '<%= theme.app %>/scss/style.scss'
                ],
                options: {
                    livereload: false
                },
                tasks: [
                    'sass'
                ]
            },
            js: {
                files: [
                    '<%= theme.app %>/js/chat.js'
                ]
            },
            html: {
                files: [
                    'tpl/*.jade'
                ]
            },
            grunt: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon', 'node-inspector', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        'node-inspector': {
            custom: {
                options: {
                    'debug-port': '<%= theme.debug.port %>' // view ./app/rc/.node-inspectorrc to more setting
                }
            }
        },

        nodemon: {
            dev: {
                script: '<%= theme.app %>/js/server.js',
                options: {
                    args: [],
                    nodeArgs: ['--debug=<%= theme.debug.port %>']
                }
            }
        }
    });

    // Load the Grunt plugins.
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

    // Show grunt task time.
    require('time-grunt')(grunt);

    // Register the default tasks.
    grunt.registerTask('default', ['clean', 'copy:pro', 'sass', 'cssmin:pro', 'uglify:pro', 'nodemon']);
    grunt.registerTask('predev', ['clean', 'copy:pro', 'sass', 'cssmin:dev', 'uglify:dev']);
    grunt.registerTask('dev', ['predev', 'concurrent']);

};
