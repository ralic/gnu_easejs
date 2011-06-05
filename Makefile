
path_build=./build
path_tools=./tools
path_lib=./lib
path_combine_output=${path_build}/ease.js
path_combine_output_full=${path_build}/ease-full.js
path_browser_test=${path_tools}/browser-test.html
path_test=./test
path_perf_test=${path_test}/perf

perf_tests := $(shell find "$(path_perf_test)" -name 'perf-*.js')

path_doc := ./doc

combine=${path_tools}/combine


.PHONY: combine min doc test test-combine


default: combine min
all:     combine min doc

# create build dir
$(path_build):
	mkdir -p "$(path_build)"

# combine all modules into easily redistributable ease.js file (intended for
# browser)
$(path_combine_output): $(src_js) | mkbuild
	${combine} > "$(path_combine_output)"
$(path_combine_output_full): $(src_js) $(src_tests) | mkbuild
	INC_TEST=1 "$(combine)" > "${path_combine_output_full}"
$(path_build)/browser-test.html: $(path_combine_output_full)
	cp "$(path_browser_test)" "$(path_build)"
combine: $(path_combine_output) $(path_build)/browser-test.html

doc:
	$(MAKE) -C $(path_doc)

test: default
	$(MAKE) -C $(path_test)

# performance tests
perf: default $(perf_tests)
perf-%.js: default
	@node $@

min: build/ease.min.js build/ease-full.min.js
build/%.min.js: build/%.js
	cat $(path_tools)/license.tpl > $@
	node $(path_tools)/minify.js < $< >> $@

install: doc-info
	[ -d $(path_info_install) ] || mkdir -p $(path_info_install)
	cp $(path_doc_output_info) $(path_info_install)

uninstall:
	rm $(path_info_install)/easejs.info

# clean up build dir
clean:
	$(MAKE) -C $(path_doc) clean
	rm -rf "${path_build}"

