module.exports = function (grunt) {

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      copy : {
        all : {
          src : 'src/clutility.js',
          dest: 'dist/clutility.js'
        }
      },
      uglify: {
        all : {
          files : {
            'dist/clutility.min.js' : ['dist/clutility.js']
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
          src: ['dist/clutility.js'],
          dest: 'dist/clutility.js',
        },
        min: {
          src: ['dist/clutility.min.js'],
          dest: 'dist/clutility.min.js',
        },
      },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['copy:all', 'uglify:all', 'concat:min', 'concat:max']);
};
