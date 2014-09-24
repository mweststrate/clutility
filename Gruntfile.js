module.exports = function (grunt) {

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      copy : {
        all : {
          src : 'src/classify.js',
          dest: 'dist/classify.js'
        }
      },
      uglify: {
        all : {
          files : {
            'dist/classify.min.js' : ['dist/classify.js']
          }
        }
      },
      concat: {
        options: {
          stripBanners: true,
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= pkg.description %>' +
            '\r\n(c) <%= pkg.author %> - <%=  pkg.license %> licensed. \r\n<%= pkg.homepage %> */\r\n',
        },
        max: {
          src: ['dist/classify.js'],
          dest: 'dist/classify.js',
        },
        min: {
          src: ['dist/classify.min.js'],
          dest: 'dist/classify.min.js',
        },
      },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['copy:all', 'uglify:all', 'concat:min', 'concat:max']);
};
