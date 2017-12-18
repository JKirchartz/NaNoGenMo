module.exports = function (grunt) {
	"use strict";

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.initConfig({
		concat: {
			gleech: {
				files: {
					'dist/gleech.js': [
						"source/header.js",
						"source/helpers.js",
						"source/glitches/*",
						"source/footer.js"
					]
				}
			}
		},
		jshint: {
			dest: "dest/**.js"
		}
	});
	// Default task(s).
	grunt.registerTask('default', [ 'concat' ]);
	grunt.registerTask('check', [ 'concat', 'jshint' ]);
	grunt.registerTask('deploy', [ 'concat', 'jshint' ]);

};
