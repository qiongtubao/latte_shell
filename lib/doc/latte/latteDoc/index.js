(function(define) {'use strict'
	define("latte_shell/doc/latte/latteDoc", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
			(function() {
				var Y = require("yuidocjs")
					, latte_lib = require("latte_lib")
					, Fs = require("latte_lib").fs
					, Path = require("path")
					, demoBuilder
					, stat = Fs.stat
					, basePath =  Path.dirname(Fs.realpathSync(__filename))
					, themeDir;
					function copyDir(addRes, src, dst) {
			         if (!fs.existsSync(src))
			        {
			            console.error("demo加载目录不存在：" + src);
			            return;
			        }
			        if (!fs.existsSync(dst))
			            fs.mkdirSync(dst);

			        // 读取目录中的所有文件/目录
			        var paths = fs.readdirSync(src);

			        paths.forEach(function(fileName) {
			            copyRes(addRes, fileName, src + '/' + path, dst)
			        });

			    }

			    function copyRes(addRes, fileName, src, dst) {
			         if (!Fs.existsSync(src))
			        {
			            console.error("demo加载文件不存在：" + src);
			            return;
			        }

			        if (addRes('res/' + fileName)) {
			            var _dst = dst + '/' + fileName,
			                readable, writable;

			            stat(src, function(err, st) {
			                if (err) {
			                    throw err;
			                }

			                // 判断是否为文件
			                if (st.isFile()) {
			                    // 创建读取流
			                    readable = Fs.createReadStream(src);
			                    // 创建写入流
			                    writable = Fs.createWriteStream(_dst);
			                    // 通过管道来传输流
			                    readable.pipe(writable);
			                }
			                // 如果是目录则递归调用自身
			                else if (st.isDirectory()) {
			                    copyDir(addRes, src, _dst);
			                }
			            });
			        }
			    }
					function isJS(file) {
			        return Path.extname(file) === '.js';
			    }

			    function isCss(file) {
			        return Path.extname(file) === '.css';
			    }

					this.build = function(config, callback) {
						var render = function(builder, cb) {
								Y.prepare([themeDir, themeDir], builder.getProjectMeta(), function(err, opts) {
									var css = [],
											script = [],
											demo = builder.options.demo;

									function addRes(res) {
											if (isJS(res)) {
													script.push(res);
											} else if (isCss(res)) {
													css.push(res);
											} else
													return false;
											return true;
									}

									if (demo) {
											demo.link && demo.link.forEach(addRes)

											if (demo.paths) {
													var resPath = builder.options.outdir + 'assets/res';
													Fs.mkdirSync(resPath);
													demo.paths.forEach(function(item) {
															if (item.charAt(item.length - 1) === '/') {
																	copyDir(addRes, item, resPath);
															} else {
																	copyRes(addRes, Path.basename(item), item, resPath);
															}
													})
											}

											if (demo.autoComplete !== false && script.length) {
													Fs.appendFile(builder.options.outdir + 'assets/code.html', '<script src="' + script.join('"></script><script src="') + '"></script>');
											}
									}

									opts.meta.css = css;
									opts.meta.script = script;

									var view = new Y.DocView(opts.meta);

									var tmplFn = Y.Handlebars.compile(opts.layouts.demo);
									var html = tmplFn(view);
									builder.files++;
									cb(html, view);
							});
					}
					var extendYUIDoc = function() {
						(function() {
							this.populateModules = function(opts) {
								var self = this;
								opts.meta.modules = [];
								opts.meta.allModules = [];

								Y.each(this.data.modules, function(v) {
										if (v.external) {
												return;
										}

										var classes = [];

										for (var cName in v.classes) {
												classes.push({
														name: cName
												});
										}

										opts.meta.allModules.push({
												displayName: v.displayName || v.name,
												name: self.filterFileName(v.name),
												description: v.description,
												classes: classes.length ? classes : null
										});

										if (!v.is_submodule) {
												var o = {
														displayName: v.displayName || v.name,
														name: self.filterFileName(v.name),
														classes: classes.length ? classes : null
												};
												if (v.submodules) {
														o.submodules = [];
														Y.each(v.submodules, function(i, k) {
																var moddef = self.data.modules[k];
																if (moddef) {
																		o.submodules.push({
																				displayName: k,
																				description: moddef.description
																		});
																		// } else {
																		//     Y.log('Submodule data missing: ' + k + ' for ' + v.name, 'warn', 'builder');
																}
														});
														o.submodules.sort(self.nameSort);
												}
												opts.meta.modules.push(o);
										}
								});
								opts.meta.modules.sort(this.nameSort);
								opts.meta.allModules.sort(this.nameSort);
								return opts;
							}
							this.writeDemo = function(cb) {
								var self = this,
										stack = new Y.Parallel();

								Y.log('Preparing demo.html', 'info', 'builder');

								render(self, stack.add(function(html, view) {
										stack.html = html;
										stack.view = view;
										Y.Files.writeFile(Path.join(self.options.outdir + 'assets/', 'demo.html'), html, stack.add(function() {}));
										Y.Files.writeFile(Path.join(self.options.outdir + 'assets/', 'show.html'), html + "<script src='js/show.js'></script>", stack.add(function() {}));
								}));

								stack.done(function(html, view) {
										Y.log('Writing demo.html', 'info', 'builder');
										cb(stack.html, stack.view);
								});
							}
						}).call(Y.DocBuilder.prototype);
					}
					var extendYUIBuilder = function() {
						var _parseCode = Y.DocBuilder.prototype._parseCode;
						(function() {
							this._parseCode = function(html) {
								return '<div class="stdoc-code">' + _parseCode.call(this,html) + "</div>";
							}

						}).call(Y.DocBuilder.prototype);
						(function() {
							this.demo = function(tagname, value, target, block) {
								var content = target["example"],
										data,titles = target["exampleTitles"];

								if(!content)
										content = target["example"] = [];

								if(!titles)
										titles = target["exampleTitles"] = [];

								if (value) {
										var data = demoBuilder.build(value, config, target);
										if(data && data.code){
												content.push(data.code);
												titles.push(data.title);
										}
								}
							}
							this.show = function(tagname, value, target, block) {
									target["show"] = true;
							}
						}).call(Y.DocParser.DIGESTERS);

					}
					var getOptions = function () {
							if (config) {
									return config;
							}
							try {
								var keys = require("../../../config").get();
								var config = require(Fs.realpathSync('.') + '/.latte/doc.json');
								config = JSON.parse(
				           latte_lib.format.templateStringFormat(JSON.stringify(config), keys)
			         	);
								return config;
							}catch(e) {
								return {};
							}
					}
						var buildDocConfig = function(data, meta, options) {
							var items = [];

							Y.each(data.modules, function(item) {
									item.name && items.push({
											type: 'module',
											name: item.name
									});
							});

							Y.each(data.classes, function(item) {
									item.name && items.push({
											type: 'class',
											name: item.name
									});
							})

							data.classitems.forEach(function(item) {
									item.name && items.push({
											type: item.itemtype,
											className: item['class'],
											name: item.name
									});
							})

							var config = {
									filterItems: items
							}

							Fs.appendFileSync(options.outdir + 'assets/js/config.js', "window['__docConfig'] = " + JSON.stringify(config)) + ";";
						}
					var buildDoc = function(options) {
						var json;

						if (!options) {
								console.log('The Options of smartDoc is not be defined!');
								return;
						}

						//混入默认设置
						config = options = Y.mix(options, {
								//代码扫描路径
								paths: ['src/'],
								//文档输出文件夹
								outdir: 'doc/',
								theme: 'default',
								//主题目录
								//themedir: themeDir,
								//辅助js文件地址
								//helpers: [themeDir + "helpers/helpers.js"],
								//demo扫描目录
								demoDir: "",
								//demo生成器地址
								demoBuilder: './demoBuilder.js',
								//demo代码生成器地址
								codeLoader: './jasmineLoader.js'
						});

						//主题判断
						if (config.themedir) {
								themeDir = config.themedir;
						} else {
								//判断是否默认主题
								themeDir = config.themedir = defaultThemes[config.theme] || defaultThemes['default'];
						}

						if (!config.helpers)
								config.helpers = [themeDir + "helpers/helpers.js"];

						demoBuilder = require(config.demoBuilder);

						try {
								json = (new Y.YUIDoc(options)).run();
						} catch (e) {
								console.log(e);
								return;
						}
						options = Y.Project.mix(json, options);

						var builder = new Y.DocBuilder(options, json);

						var starttime = Date.now();
						//console.log('Start SmartDoc compile...');
						//console.log('Scanning: ' + options.paths);
						//console.log('Output: ' + options.outdir);

						builder.compile(function() {
								buildDocConfig(builder.data, builder._meta, options);

								builder.writeDemo(function() {
										callback && callback();
										console.log('SmartDoc compile completed in ' + ((Date.now() - starttime) / 1000) + ' seconds');
								});
						});
					}
						var defaultThemes = {
							"default": basePath+"/theme-smart/",
							"ui": basePath+"/theme-smart-ui/"
						};
						extendYUIDoc();
						extendYUIBuilder();
						buildDoc(getOptions());
					}
			}).call(module.exports);
  });
 })(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
