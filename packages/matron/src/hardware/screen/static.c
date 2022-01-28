#include <emscripten.h>

#include "hardware/screen/screens.h"
#include <stdio.h>
#include <stdlib.h>

uint8_t data[128 * 64 * 4];
EM_BOOL dirty = EM_FALSE;

uint8_t* EMSCRIPTEN_KEEPALIVE screen_get_data() {
    dirty = EM_FALSE;
    return data;
}

EM_BOOL EMSCRIPTEN_KEEPALIVE screen_dirty() {
    return dirty;
}

typedef struct _screen_static_priv {
} screen_static_priv_t;

static int screen_static_config(matron_io_t *io, lua_State * l);
static int screen_static_setup(matron_io_t *io);
static void screen_static_destroy(matron_io_t *io);
static void screen_static_paint(matron_fb_t *io);
static void screen_static_bind(matron_fb_t *fb, cairo_surface_t *surface);

static void screen_static_surface_destroy(void *priv);
static cairo_surface_t *screen_static_surface_create(screen_static_priv_t *priv);

screen_ops_t screen_static_ops = {
    .io_ops.name = "screen:static",
    .io_ops.type = IO_SCREEN,
    .io_ops.data_size = sizeof(screen_static_priv_t),
    .io_ops.config = screen_static_config,
    .io_ops.setup = screen_static_setup,
    .io_ops.destroy = screen_static_destroy,

    .paint = screen_static_paint,
    .bind = screen_static_bind,
};


int screen_static_config(matron_io_t *io, lua_State *l) {
    (void)io;
    (void)l;
    return 0;
}


int screen_static_setup(matron_io_t *io) {
    matron_fb_t *fb = (matron_fb_t *)io;
    fb->surface = screen_static_surface_create((screen_static_priv_t *)io->data);
    if (!fb->surface) {
        fprintf(stderr, "ERROR (%s) failed to create surface\n", io->ops->name);
        return -1;
    }
    fb->cairo = cairo_create(fb->surface);
    return 0;
}

static void screen_static_destroy(matron_io_t *io) {
    matron_fb_t *fb = (matron_fb_t *)io;
    cairo_destroy(fb->cairo);
    cairo_surface_destroy(fb->surface);
}

static void screen_static_paint(matron_fb_t *fb) {
    screen_static_priv_t *priv = fb->io.data;
    cairo_paint(fb->cairo);
    dirty = EM_TRUE;
}

static void screen_static_bind(matron_fb_t *fb, cairo_surface_t *surface) {
    cairo_set_operator(fb->cairo, CAIRO_OPERATOR_SOURCE);
    cairo_set_source_surface(fb->cairo, surface, 0, 0);
}

static void screen_static_surface_destroy(void *data) {
    screen_static_priv_t *priv = data;

    if (priv == NULL) {
        return;
    }
    free(priv);
}

static cairo_surface_t *screen_static_surface_create(screen_static_priv_t *priv) {
    cairo_surface_t *surface;

    surface = cairo_image_surface_create_for_data(data, 
        CAIRO_FORMAT_ARGB32, 128, 64,
        cairo_format_stride_for_width(CAIRO_FORMAT_ARGB32, 128));
    cairo_surface_set_user_data(surface, NULL, priv, &screen_static_surface_destroy);

    return surface;
}
