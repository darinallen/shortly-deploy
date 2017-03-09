module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                seperator: ';',
            },
            dist: {
                src: ['public/client/**/*.js'],
                dest: 'public/dist/<%= pkg.name %>.js',
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        },

        nodemon: {
            dev: {
                script: 'server.js'
            }
        },

        uglify: {
          options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
          },
          dist: {
            files: {
              'public/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
            }
          }
        },

        eslint: {
            target: [
                'public/dist/<%= pkg.name %>.js'
            ]
        },

        cssmin: {
          options: {
            keepSpecialComments: 0
          },
          dist: {
            files: {
              'public/dist/style.min.css': 'public/style.css'
            }
          }
        },

        watch: {
            scripts: {
                files: [
                    'public/client/**/*.js',
                    'public/lib/**/*.js',
                ],
                tasks: [
                    'concat',
                    'uglify'
                ]
            },
            css: {
                files: 'public/*.css',
                tasks: ['cssmin']
            }
        },

        shell: {
            prodServer: {
              command: 'git push live master',
              options: {
                stdout: true,
                stderr: true,
                failOnError: true
              }
                    }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('server-dev', function(target) {
        grunt.task.run(['nodemon', 'watch']);
    });

    ////////////////////////////////////////////////////
    // Main grunt tasks
    ////////////////////////////////////////////////////

    grunt.registerTask('test', [
        'eslint',
        'mochaTest'
    ]);

    grunt.registerTask('build', ['concat', 'uglify', 'cssmin']);

    grunt.registerTask('upload', function(n) {
        if (grunt.option('prod')) {
            grunt.task.run(['shell:prodServer']);// add your production server task here
        } else {
            grunt.task.run(['server-dev']);
        }
    });

    grunt.registerTask('deploy', [
        'test',
        'build',
        'upload'
    ]);


};
