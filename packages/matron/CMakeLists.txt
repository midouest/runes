project(matron-web)
cmake_minimum_required(VERSION 3.16.3)

include(ExternalProject)

set(DIST_DIR ${CMAKE_CURRENT_BINARY_DIR}/dist)
set(INCLUDE_DIR ${DIST_DIR}/include)
set(STATIC_LIB_DIR ${DIST_DIR}/lib)

if(CMAKE_BUILD_TYPE MATCHES DEBUG)
    set(CFLAGS -g)
    set(LDFLAGS -g)
elseif(CMAKE_BUILD_TYPE MATCHES MINSIZEREL)
    set(CFLAGS -Os)
    set(LDFLAGS -Os)
elseif(CMAKE_BUILD_TYPE MATCHES RELEASE)
    set(CFLAGS -O3)
    set(LDFLAGS -O3)
elseif(CMAKE_BUILD_TYPE MATCHES RELWITHDEBINFO)
    set(CFLAGS "-O3 -g")
    set(LDFLAGS "-O3 -g")
endif()

# ZLIB #########################################################################

set(Z_CMAKE_ARGS
    -DCMAKE_INSTALL_PREFIX=<INSTALL_DIR>
    -DCMAKE_C_FLAGS=${CFLAGS})
set(Z_STATIC_LIB ${STATIC_LIB_DIR}/libz.a)

ExternalProject_Add(
    libz
    URL https://zlib.net/zlib-1.2.13.tar.gz
    PREFIX ${CMAKE_CURRENT_BINARY_DIR}/lib/zlib
    INSTALL_DIR ${DIST_DIR}
    CMAKE_COMMAND emcmake ${CMAKE_COMMAND}
    CMAKE_ARGS ${Z_CMAKE_ARGS}
    BUILD_BYPRODUCTS ${Z_STATIC_LIB}
)

add_library(z STATIC IMPORTED GLOBAL)
add_dependencies(z libz)
set_target_properties(z PROPERTIES IMPORTED_LOCATION ${Z_STATIC_LIB})

# PNG ##########################################################################

set(PNG_STATIC_LIB ${STATIC_LIB_DIR}/libpng.a)
set(PNG_CMAKE_ARGS
    -DPNG_SHARED=OFF
    -DM_LIBRARY=""
    -DZLIB_INCLUDE_DIR=${INCLUDE_DIR}
    -DZLIB_LIBRARY=${Z_STATIC_LIB}
    -DCMAKE_INSTALL_PREFIX=<INSTALL_DIR>
    -DCMAKE_C_FLAGS=${CFLAGS})

ExternalProject_Add(
    libpng
    URL https://sourceforge.net/projects/libpng/files/libpng16/1.6.37/libpng-1.6.37.tar.xz
    PREFIX ${CMAKE_CURRENT_BINARY_DIR}/lib/libpng
    INSTALL_DIR ${DIST_DIR}
    CMAKE_COMMAND emcmake ${CMAKE_COMMAND}
    CMAKE_ARGS ${PNG_CMAKE_ARGS}
    BUILD_BYPRODUCTS ${PNG_STATIC_LIB}
    DEPENDS z
)

add_library(png STATIC IMPORTED GLOBAL)
add_dependencies(png libpng)
set_target_properties(png PROPERTIES IMPORTED_LOCATION ${PNG_STATIC_LIB})

# FREETYPE #####################################################################

set(FREETYPE_STATIC_LIB ${STATIC_LIB_DIR}/libfreetype.a)
set(FREETYPE_CMAKE_ARGS
    -DCMAKE_INSTALL_PREFIX=<INSTALL_DIR>
    -DCMAKE_C_FLAGS=${CFLAGS})

ExternalProject_Add(
    libfreetype
    URL  https://download.savannah.gnu.org/releases/freetype/freetype-2.11.1.tar.xz
    PREFIX ${CMAKE_CURRENT_BINARY_DIR}/lib/freetype
    INSTALL_DIR ${DIST_DIR}
    CMAKE_COMMAND emcmake ${CMAKE_COMMAND}
    CMAKE_ARGS ${FREETYPE_CMAKE_ARGS}
    BUILD_BYPRODUCTS ${FREETYPE_STATIC_LIB}
)

add_library(freetype STATIC IMPORTED GLOBAL)
add_dependencies(freetype libfreetype)
set_target_properties(freetype PROPERTIES IMPORTED_LOCATION ${FREETYPE_STATIC_LIB})

# PIXMAN #######################################################################

set(PIXMAN_PREFIX ${CMAKE_CURRENT_BINARY_DIR}/lib/pixman)
set(PIXMAN_SOURCE_DIR ${PIXMAN_PREFIX}/src/pixman)
set(PIXMAN_STATIC_LIB ${STATIC_LIB_DIR}/libpixman-1.a)
set(PIXMAN_CONFIGURE_COMMAND
    emconfigure ${PIXMAN_SOURCE_DIR}/configure
    "CFLAGS=-mbulk-memory -matomics ${CFLAGS}"
    LDFLAGS=${LDFLAGS}
    --enable-shared=no
    --prefix=<INSTALL_DIR>)

ExternalProject_Add(
    libpixman
    URL https://cairographics.org/releases/pixman-0.40.0.tar.gz
    PREFIX ${PIXMAN_PREFIX}
    SOURCE_DIR ${PIXMAN_SOURCE_DIR}
    INSTALL_DIR ${DIST_DIR}
    CONFIGURE_COMMAND ${PIXMAN_CONFIGURE_COMMAND}
    PATCH_COMMAND patch ${PIXMAN_SOURCE_DIR}/pixman/pixman-bits-image.c ${CMAKE_CURRENT_SOURCE_DIR}/patch/pixman-bits-image.patch
    BUILD_COMMAND cd pixman && emmake make
    INSTALL_COMMAND cd pixman && emmake make install
    BUILD_BYPRODUCTS ${PIXMAN_STATIC_LIB}
)

add_library(pixman STATIC IMPORTED GLOBAL)
add_dependencies(pixman libpixman)
set_target_properties(pixman PROPERTIES IMPORTED_LOCATION ${PIXMAN_STATIC_LIB})

# CAIRO ########################################################################

set(CAIRO_PREFIX ${CMAKE_CURRENT_BINARY_DIR}/lib/cairo)
set(CAIRO_SOURCE_DIR ${CAIRO_PREFIX}/src/cairo)
set(CAIRO_STATIC_LIB ${STATIC_LIB_DIR}/libcairo.a)
set(CAIRO_CONFIGURE_COMMAND
    emconfigure ${CAIRO_SOURCE_DIR}/configure
    "PKG_CONFIG_PATH=${STATIC_LIB_DIR}/pkgconfig"
    "png_REQUIRES=libpng"
    "CFLAGS=-I${INCLUDE_DIR} -I${INCLUDE_DIR}/libpng16 -mbulk-memory -matomics ${CFLAGS}"
    "LDFLAGS=-L${STATIC_LIB_DIR} ${LDFLAGS}"
    "LIBS=-lpng16 -lz"
    "pixman_CFLAGS=-I${INCLUDE_DIR}/pixman-1"
    "pixman_LIBS=-L${STATIC_LIB_DIR} -lpixman-1"
    "FREETYPE_CFLAGS=-I${INCLUDE_DIR}/freetype2"
    "FREETYPE_LIBS=-L${STATIC_LIB_DIR} -lfreetype"
    "ax_cv_c_float_words_bigendian=no" # required for Ubuntu build
    --enable-shared=no
    --prefix=<INSTALL_DIR>)

ExternalProject_Add(
    libcairo
    URL https://www.cairographics.org/releases/cairo-1.16.0.tar.xz
    PREFIX ${CAIRO_PREFIX}
    SOURCE_DIR ${CAIRO_SOURCE_DIR}
    INSTALL_DIR ${DIST_DIR}
    CONFIGURE_COMMAND ${CAIRO_CONFIGURE_COMMAND}
    PATCH_COMMAND patch ${CAIRO_SOURCE_DIR}/src/cairo-path-fill.c ${CMAKE_CURRENT_SOURCE_DIR}/patch/cairo-path-fill.patch
    BUILD_COMMAND cd src && emmake make
    INSTALL_COMMAND cd src && emmake make install
    BUILD_BYPRODUCTS ${CAIRO_STATIC_LIB}
    DEPENDS libz libpng libpixman libfreetype
)

add_library(cairo STATIC IMPORTED GLOBAL)
add_dependencies(cairo libcairo)
set_target_properties(cairo PROPERTIES IMPORTED_LOCATION ${CAIRO_STATIC_LIB})

# LUA ##########################################################################

set(LUA_STATIC_LIB ${STATIC_LIB_DIR}/liblua.a)

ExternalProject_Add(
    liblua
    URL https://www.lua.org/ftp/lua-5.3.6.tar.gz
    PREFIX ${CMAKE_CURRENT_BINARY_DIR}/lib/lua
    INSTALL_DIR ${DIST_DIR}
    CONFIGURE_COMMAND ""
    BUILD_IN_SOURCE 1
    BUILD_COMMAND emmake make "CC=emcc" "AR=emar rcu" "RANLIB=emranlib" "CFLAGS=${CFLAGS}" "LDFLAGS=${LDFLAGS}" posix
    INSTALL_COMMAND emmake make "INSTALL_TOP=<INSTALL_DIR>" install
    BUILD_BYPRODUCTS ${LUA_STATIC_LIB}
)

add_library(lua STATIC IMPORTED GLOBAL)
add_dependencies(lua liblua)
set_target_properties(lua PROPERTIES IMPORTED_LOCATION ${LUA_STATIC_LIB})

# OPENBSD HEADERS ##############################################################

set(SYS_INCLUDE_DIR ${INCLUDE_DIR}/sys)
set(SYS_BASE_URL https://cvsweb.openbsd.org/cgi-bin/cvsweb/~checkout~/src/sys/sys)

file(DOWNLOAD
    ${SYS_BASE_URL}/_null.h?rev=1.1&content-type=text/plain
    ${SYS_INCLUDE_DIR}/_null.h)

file(DOWNLOAD
    ${SYS_BASE_URL}/queue.h?rev=1.46&content-type=text/plain
    ${SYS_INCLUDE_DIR}/queue.h)

# MATRON #######################################################################

set(NORNS_DIR ${CMAKE_CURRENT_SOURCE_DIR}/norns)
set(MATRON_SRC_DIR ${NORNS_DIR}/matron/src)

include_directories(
    ${INCLUDE_DIR}/cairo
    ${INCLUDE_DIR}/freetype2
    ${INCLUDE_DIR}
    ${MATRON_SRC_DIR}
    ${MATRON_SRC_DIR}/hardware
    ${MATRON_SRC_DIR}/hardware/screen)

link_directories(${STATIC_LIB_DIR})

add_executable(matron
    ${MATRON_SRC_DIR}/config.c
    ${MATRON_SRC_DIR}/lua_eval.c
    ${MATRON_SRC_DIR}/weaver.c
    ${MATRON_SRC_DIR}/hardware/io.c
    ${MATRON_SRC_DIR}/hardware/screen.c
    ${MATRON_SRC_DIR}/hardware/screen/static.c)

add_dependencies(matron z png pixman freetype cairo lua)
target_link_libraries(matron z png pixman freetype cairo lua)

set(USER web_user)
set(HOME /home/${USER})

if(CFLAGS)
    set_target_properties(matron PROPERTIES COMPILE_FLAGS ${CFLAGS})
endif()

set(EMSCRIPTEN_LINK_FLAGS
    "${LDFLAGS} \
     -s INITIAL_MEMORY=32MB \
     -s ALLOW_MEMORY_GROWTH=1 \
     -s EXPORTED_RUNTIME_METHODS=cwrap \
     -s MODULARIZE \
     -s EXPORT_ES6=1 \
     -s ENVIRONMENT=worker \
     --no-entry \
     --preload-file ${NORNS_DIR}/resources@/${HOME}/norns/resources \
     --preload-file ${NORNS_DIR}/lua/core/config.lua@/${HOME}/norns/lua/core/config.lua \
     --preload-file ${NORNS_DIR}/lua/core/norns.lua@/${HOME}/norns/lua/core/norns.lua \
     --preload-file ${NORNS_DIR}/lua/core/screen.lua@/${HOME}/norns/lua/core/screen.lua \
     --preload-file ${NORNS_DIR}/lua/core/startup.lua@/${HOME}/norns/lua/core/startup.lua \
     --preload-file ${NORNS_DIR}/lua/lib/elca.lua@/${HOME}/norns/lua/lib/elca.lua \
     --preload-file ${NORNS_DIR}/lua/lib/envgraph.lua@/${HOME}/norns/lua/lib/envgraph.lua \
     --preload-file ${NORNS_DIR}/lua/lib/er.lua@/${HOME}/norns/lua/lib/er.lua \
     --preload-file ${NORNS_DIR}/lua/lib/filtergraph.lua@/${HOME}/norns/lua/lib/filtergraph.lua \
     --preload-file ${NORNS_DIR}/lua/lib/filters.lua@/${HOME}/norns/lua/lib/filters.lua \
     --preload-file ${NORNS_DIR}/lua/lib/formatters.lua@/${HOME}/norns/lua/lib/formatters.lua \
     --preload-file ${NORNS_DIR}/lua/lib/graph.lua@/${HOME}/norns/lua/lib/graph.lua \
     --preload-file ${NORNS_DIR}/lua/lib/intonation.lua@/${HOME}/norns/lua/lib/intonation.lua \
     --preload-file ${NORNS_DIR}/lua/lib/musicutil.lua@/${HOME}/norns/lua/lib/musicutil.lua \
     --preload-file ${NORNS_DIR}/lua/lib/sequins.lua@/${HOME}/norns/lua/lib/sequins.lua \
     --preload-file ${NORNS_DIR}/lua/lib/tabutil.lua@/${HOME}/norns/lua/lib/tabutil.lua \
     --preload-file ${NORNS_DIR}/lua/lib/ui.lua@/${HOME}/norns/lua/lib/ui.lua \
     --preload-file ${NORNS_DIR}/lua/lib/util.lua@/${HOME}/norns/lua/lib/util.lua \
     --preload-file ${NORNS_DIR}/lua/lib/voice.lua@/${HOME}/norns/lua/lib/voice.lua \
     --preload-file ${NORNS_DIR}/matronrc.lua@/${HOME}/matronrc.lua")
set_target_properties(matron PROPERTIES LINK_FLAGS ${EMSCRIPTEN_LINK_FLAGS})

# MISC #########################################################################

file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/matron.d.ts
    DESTINATION ${CMAKE_CURRENT_BINARY_DIR})
