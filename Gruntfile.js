var util = require('./test/lib/karma-util.js');
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.initConfig({
    shell: {
      install: {
        command: 'node ./node_modules/bower/bin/bower install'
      },
      compile: {
        command: 'node ./node_modules/typescript/bin/tsc src/Main.ts --out build/earth.js',
        options: {
            stdout: true,
            failOnError: true
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '0.0.0.0',
          base: './',
          keepalive: true
        }
      }
    },
    test: {
       unit: './test/karma-unit.conf.js'
    },
    /*
    concat: {
      scripts: {
        options: {
          separator: ';'
        },
        dest: './libs/threejsLibs.js',
        src: [
          'components/threejs/examples/js/Detector.js',
          'components/threejs/build/three.min.js',
          'components/threejs/examples/js/controls/TrackballControls.js',
          'components/threejs/examples/js/libs/tween.min.js',
          'components/threejs/examples/fonts/helvetiker_bold.typeface.js',
          'components/threejs/examples/fonts/helvetiker_regular.typeface.js'
        ]
      },
    },
    */
    uglify: {
      my_target: {
        files: {
          'build/earth.min.js': ['build/earth.js']
        }
      }
    }
  });

  grunt.registerTask('install', ['shell:install']);

  //grunt.registerTask('compile', ['shell:compile','concat']);
  grunt.registerTask('compile', ['shell:compile']);

  grunt.registerMultiTask('test', 'Run and watch the unit tests with Karma', function() {
    grunt.task.run(['compile']);
    util.startKarma.call(util, this.data, true, this.async());
  });

  grunt.registerTask('dev', ['install','compile']);

  grunt.registerTask('build', ['compile','uglify']);

  grunt.registerTask('server', ['connect:server']);
};
