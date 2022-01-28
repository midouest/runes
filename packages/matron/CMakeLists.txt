project(norns-wasm)
cmake_minimum_required(VERSION 3.22)

include(ExternalProject)

set(DIST_DIR ${CMAKE_CURRENT_BINARY_DIR}/dist)
set(INCLUDE_DIR ${DIST_DIR}/include)
set(STATIC_LIB_DIR ${DIST_DIR}/lib)

# FREETYPE #####################################################################

set(FREETYPE_STATIC_LIB ${STATIC_LIB_DIR}/libfreetype.a)
set(FREETYPE_CMAKE_ARGS -DCMAKE_INSTALL_PREFIX=<INSTALL_DIR>)

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
    "CFLAGS=-mbulk-memory -matomics"
    --enable-shared=no
    --prefix=<INSTALL_DIR>)

ExternalProject_Add(
    libpixman
    URL https://cairographics.org/releases/pixman-0.40.0.tar.gz
    PREFIX ${PIXMAN_PREFIX}
    SOURCE_DIR ${PIXMAN_SOURCE_DIR}
    INSTALL_DIR ${DIST_DIR}
    CONFIGURE_COMMAND ${PIXMAN_CONFIGURE_COMMAND}
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
    "CFLAGS=-mbulk-memory -matomics"
    "pixman_CFLAGS=-I${INCLUDE_DIR}/pixman-1"
    "pixman_LIBS=-L${STATIC_LIB_DIR} -lpixman-1"
    "FREETYPE_CFLAGS=-I${INCLUDE_DIR}/freetype2"
    "FREETYPE_LIBS=-L${STATIC_LIB_DIR} -lfreetype"
    --enable-shared=no
    --enable-script=no
    --enable-ps=no
    --enable-svg=no
    --enable-pdf=no
    --enable-png=no
    --enable-interpreter=no
    --prefix=<INSTALL_DIR>)

ExternalProject_Add(
    libcairo
    URL https://www.cairographics.org/releases/cairo-1.16.0.tar.xz
    PREFIX ${CAIRO_PREFIX}
    SOURCE_DIR ${CAIRO_SOURCE_DIR}
    INSTALL_DIR ${DIST_DIR}
    CONFIGURE_COMMAND ${CAIRO_CONFIGURE_COMMAND}
    BUILD_COMMAND cd src && emmake make
    INSTALL_COMMAND cd src && emmake make install
    BUILD_BYPRODUCTS ${CAIRO_STATIC_LIB}
    DEPENDS libpixman libfreetype
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
    BUILD_COMMAND emmake make "CC=emcc" "AR=emar rcu" "RANLIB=emranlib" posix
    INSTALL_COMMAND emmake make "INSTALL_TOP=<INSTALL_DIR>" install
    BUILD_BYPRODUCTS ${LUA_STATIC_LIB}
)

add_library(lua STATIC IMPORTED GLOBAL)
add_dependencies(lua lualua)
set_target_properties(lua PROPERTIES IMPORTED_LOCATION ${LUA_STATIC_LIB})


# MATRON #######################################################################

include_directories(
    ${INCLUDE_DIR}/cairo
    ${INCLUDE_DIR}/freetype2
    ${INCLUDE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/src
    ${CMAKE_CURRENT_SOURCE_DIR}/src/hardware
    ${CMAKE_CURRENT_SOURCE_DIR}/src/hardware/screen)

link_directories(${STATIC_LIB_DIR})

add_executable(index
    src/config.c
    src/lua_eval.c
    src/weaver.c
    src/hardware/io.c
    src/hardware/screen.c
    src/hardware/screen/static.c)

add_dependencies(index pixman freetype cairo lua)
target_link_libraries(index pixman freetype cairo lua)

set(USER web_user)
set(HOME /home/${USER})

set(EMSCRIPTEN_LINK_FLAGS
    "-s INITIAL_MEMORY=32MB \
     -s ALLOW_MEMORY_GROWTH=1 \
     -s EXPORTED_RUNTIME_METHODS=cwrap \
     -s MODULARIZE \
     -s EXPORT_ES6=1 \
     -s ENVIRONMENT='web' \
     --no-entry \
     --embed-file ${CMAKE_CURRENT_SOURCE_DIR}/resources@/${HOME}/norns/resources \
     --embed-file ${CMAKE_CURRENT_SOURCE_DIR}/lua@/${HOME}/norns/lua \
     --embed-file ${CMAKE_CURRENT_SOURCE_DIR}/matronrc.lua@/${HOME}/matronrc.lua")
set_target_properties(index PROPERTIES LINK_FLAGS ${EMSCRIPTEN_LINK_FLAGS})
