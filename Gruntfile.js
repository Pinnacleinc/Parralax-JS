module.exports = function(grunt){
	// Project configuration.
	grunt.initConfig({
		stylus: {
		  compile: {
		    options: {
		      use: [
		        function () { return require('autoprefixer-stylus')('last 2 versions', 'ie 8'); }
		      ],
		      banner: '/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\nTHIS FILE IS COMPILED. EDIT THE ORIGINAL STYLUS FILE IN SRC/, NOT THIS!!\n\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n',
		      compress: false
		    },
		    files: [
		    	{
		    		extDot: "last", // Extensions in filenames begin after the last dot
		    		expand: true, // Enable dynamic expansion
		    		flatten: true, // Remove all path parts from generated dest paths
		    		src: ['css/src/*.styl'], // Actual pattern(s) to match - files that end in styl in folder
		    		ext: '.css', // Dest filepaths will have this extension
		    		dest: 'css/'
		    	},
		    ]
		  }
		},		
		concat: {
			all: {
				files: [
						{
					      src: ['js/master.js', 'js/test.js'],
					      dest: 'build/js/scripts.min.js'
					    },
					    {
					      src: ['css/main.css', 'css/theme.css'],
					      dest: 'build/css/styles.min.css'
					    }
					]
				} // end all     
		 }, // end concat
		connect: {
		    server: {
		        options: {
			      port: 8000,
			      hostname: 'localhost',
			      livereload: 35729,
			      open:{
			      	target: "http://localhost:8000"
			      }
		        }
		    }
		},		 
		watch: {
		    options: {
		      livereload: true,
		    },			
			stylus: {
				files: ['css/src/**/*.styl'],
				options: {
					spawn: false,
				},
			},
		    html: {    
		        files: ["**/*.html"]
		    },
		    js: {    
		        files: ["js/**/*.js"]
		    }		    		 
		},
		cssmin: {
			all: {
				options: {
			      level: {
			        1: {
			          specialComments: 0
			        }
			      }					
				},
				files: [
					{
						expand: true,
						src: 'build/css/styles.min.css'
					}
				]
			}
		},
		uglify: {
			all: {
				files: [
					{
						expand: true,
						src: 'build/js/scripts.min.js'
					},
				]
			}
		},		
	}); // End of InitConfig


	// Used in my watch task.

	grunt.event.on('watch', function (action, filepath) {
			var
				dst, ext, files;
			dst = filepath.split('.');
			ext = dst.slice(-1);
			if (ext == 'styl') {
				// construct destination path
				dst.splice(-1,1,'css');
				dst = dst.join('.').split(/[/\\]/);
				dst.splice(-2,1);
				dst = dst.join('/');

				if (action != 'deleted') {
					// replace stylus task dynamic pattern
					files = {};
					files[dst] = filepath;
					grunt.config('stylus.compile.files', files);
					grunt.task.run('stylus:compile');
				} else {
					// delete obsolete css file
					grunt.file.delete(dst);
					grunt.log.writeln('File "' + dst + '" deleted.');
				}

			}
		});	

	// Loading plugins
	grunt.loadNpmTasks('grunt-contrib-stylus');	//. Allows me to create Stylus files and converts to css.
	grunt.loadNpmTasks('grunt-contrib-concat'); // Creates bundled files
	grunt.loadNpmTasks('grunt-contrib-watch');	// Watches html and css for any changes
	grunt.loadNpmTasks('grunt-contrib-connect'); // Live reloads page of html but dependent on watch
	grunt.loadNpmTasks('grunt-contrib-cssmin'); // Minifies CSS but dependant on concat.
	grunt.loadNpmTasks('grunt-contrib-uglify'); // Minifies JS but dependent on concat.

	// Features
	grunt.registerTask('default', ['stylus:compile']); // Type: grunt - it compiles
	grunt.registerTask('production', ['stylus:compile','concat','cssmin', 'uglify']); // Type: grunt production - it compiles && minifies
	grunt.registerTask("server", ["connect", "watch"]); // Type grunt server -- Creates a server and checks for any changes in the html/css

};