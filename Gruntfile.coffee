module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    uglify:
      build:
        src: 'js/*.js'
        dest: 'dist/js/app.js'

    coffee:
      glob_to_multiple:
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
        files: [
          expand: true
          cwd: 'templates'
          src: ['*.slim', '!_*.slim']
          dest: 'dist'
          ext: '.html'
        ]

    watch:
      options:
        livereload: true
        spawn: false

      coffee:
        files: 'coffee/*.coffee'
        tasks: ['coffee']

      js:
        files: 'js/*.js'
        tasks: ['uglify']

      sass:
        files: 'scss/*.scss'
        tasks: ['sass']

      templates:
        files: 'templates/**/*.slim'
        tasks: ['slim']

  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-coffee')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-slim')

  grunt.loadNpmTasks('grunt-contrib-watch')

  # Default task(s).
  grunt.registerTask('default', ['sass', 'coffee', 'slim', 'uglify'])
