module.exports = function(grunt) {

//Configure tasks
grunt.initConfig({

  pkg: grunt.file.readJSON('package.json'),

  wiredep: {
    task: {
      src: [
        'public/index.dev.html'
      ]
    }
  },

  includeSource: {
    options: {
      basePath : 'public'
    },
    dist: {
      files: {
        'public/index.dev.html': 'public/index.tpl.html'
      }
    }
  },

  clean: ['public/build/*'],
  jshint: {
    all: ['Gruntfile.js','server.js','public/app/**/*.js']
  },

  concat: {
    options: {
      separator: '\n//======================\n',
      banner: '/*! <%= pkg.name %> concatenated <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    },
    dist: {
      src: 'public/app/**/*.js',
      dest: 'public/build/custom.concat.js'
    }
  },

  ngAnnotate: {
    demo: {
      files: {
        'public/build/custom.withAnnot.js': ['public/build/custom.concat.js']
      }
    }
  },

  uglify: {
    options: {
      banner: '//uglified\n'
    },
    build: {
      src: 'public/build/custom.withAnnot.js',
      dest: 'public/build/custom.min.js'
    }
  },

  postcss: {
    options: {
      processors: [      
        require('autoprefixer-core')({browsers: 'last 2 versions'}),        
      ]
    },
    dist: {
      src: 'public/css/style.css',
      dest: 'public/build/style.prefix.css'
    }
  },

  cssmin: {
    target: {
      files: {
        'public/build/style.min.css': ['public/build/style.prefix.css']
      }
    }
  },

});


// Load plugins
grunt.loadNpmTasks('grunt-wiredep');
grunt.loadNpmTasks('grunt-include-source');
grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-ng-annotate');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-postcss');
grunt.loadNpmTasks('grunt-contrib-cssmin');


// Register tasks
grunt.registerTask('default','dev');
grunt.registerTask('dev', ['includeSource','wiredep']);
grunt.registerTask('prod', ['clean', 'concat', 'ngAnnotate','uglify','postcss','cssmin']);

};