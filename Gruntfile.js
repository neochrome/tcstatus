module.exports = function( grunt ) {
	grunt.initConfig({
		jsonlint: {
			pkg: {
				src: ['package.json']
			},
			bower: {
				src: ['bower.json', '.bowerrc']
			},
			manifest: {
				src: ['src/manifest.json']
			},
			jshintrc: {
				src: ['.jshintrc', 'src/.jshintrc']
			},
		},
		jshint: {
			grunt: {
				src: 'Gruntfile.js',
				options: {
					jshintrc: '.jshintrc'
				}
			},
			src: {
				src: 'src/**/*.js',
				options: {
					jshintrc: 'src/.jshintrc',
					ignores: ['src/lib/**']
				}
			}
		},
		watch: {
			files: ['Gruntfile.js', '*.json', 'src/**/*.*'],
			tasks: 'default'
		},
		bump: {
			options: {
				files: ['package.json', 'bower.json', 'src/manifest.json'],
				commit: true,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['package.json', 'bower.json', 'src/manifest.json'],
				createTag: true,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jsonlint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-bump');

	grunt.registerTask('lint', ['jshint', 'jsonlint']);
	grunt.registerTask('default', ['lint']);
};
