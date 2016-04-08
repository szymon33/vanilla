module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    uglify:
      build:
        src: 'js/*.js'
        dest: 'dist/js/app.js'

    coffee:
      glob_to_multiple:
        options:
          bare: true
        expand: true
        flatten: true
        cwd: 'coffee'
        src: ['*.coffee']
        dest: 'js'
        ext: '.js'

    sass:
      dist:
        # options:
        #   style: 'compressed'
        files: [
          expand: true
          cwd: 'scss'
          src: ['*.scss', '*.sass', '!_*.scss', '!_*.sass']
          dest: 'dist/stylesheets'
          ext: '.css'
        ]

    slim:
      dist:
        options:
          pretty: true
        files: [{
          expand: true
          cwd: 'templates'
          src: ['*.slim', '!_*.slim']
          dest: 'dist'
          ext: '.html'
        }]

    copy:
      dist:
        files: [{
          expand: true
          cwd: 'vendors/'
          src: ['**']
          dest: 'dist/'
        }]

    jshint:
      all: ['js/*.js', 'tests/**/*.js']

    mocha:
      all:
        src: ['tests/index.template.html']
      options:
        run: true

    watch:
      options:
        livereload: true
        spawn: false

      coffee:
        files: 'coffee/*.coffee'
        tasks: ['coffee', 'mocha:all']

      js:
        files: 'js/**'
        tasks: ['uglify']

      sass:
        files: 'scss/*.scss'
        tasks: ['sass']

      templates:
        files: 'templates/**/*.slim'
        tasks: ['slim']

      vendors:
        files: 'vendors/**'
        tasks: ['copy']

      mocha:
        files: 'tests/**'
        tasks: ['mocha']

  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-slim')
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-mocha')

  grunt.loadNpmTasks('grunt-contrib-watch')

  # Default task(s).
  grunt.registerTask('test', ['jshint', 'mocha'])
  grunt.registerTask('default', ['copy', 'sass', 'coffee', 'slim', 'uglify', 'mocha'])
