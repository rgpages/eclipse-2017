module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    sass: {
      options: {
        noCache: true,
        precision: 14,
        sourcemap: 'none'
      },
      development: {
        files: {
          'css/main.css': 'src/sass/main.scss'
        }
      }
    },
    
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist: {
        // the files to concatenate
        src: ['src/js/leaflet.js','src/js/lights.js','src/js/map.js','src/js/main.js'],
        // the location of the resulting JS file
        dest: 'js/scripts.js'
      }
    },
    
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'js/scripts.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    
    watch: {
      styles: {
        files: ['src/sass/**/*', 'src/js/*.js'], // which files to watch
        tasks: ['sass', 'concat', 'uglify'],
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['sass', 'concat', 'uglify']);
}
