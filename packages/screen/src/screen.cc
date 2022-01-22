#include "screen.h"

#define NUM_OPS 29
#define NUM_FONTS 67

static double c[16] = {0, 0.066666666666667, 0.13333333333333, 0.2, 0.26666666666667, 0.33333333333333,
                       0.4, 0.46666666666667, 0.53333333333333, 0.6, 0.66666666666667, 0.73333333333333,
                       0.8, 0.86666666666667, 0.93333333333333, 1};

static cairo_operator_t ops[NUM_OPS] = {
    CAIRO_OPERATOR_OVER,
    CAIRO_OPERATOR_XOR,
    CAIRO_OPERATOR_ADD,
    CAIRO_OPERATOR_SATURATE,
    CAIRO_OPERATOR_MULTIPLY,
    CAIRO_OPERATOR_SCREEN,
    CAIRO_OPERATOR_OVERLAY,
    CAIRO_OPERATOR_DARKEN,
    CAIRO_OPERATOR_LIGHTEN,
    CAIRO_OPERATOR_COLOR_DODGE,
    CAIRO_OPERATOR_COLOR_BURN,
    CAIRO_OPERATOR_HARD_LIGHT,
    CAIRO_OPERATOR_SOFT_LIGHT,
    CAIRO_OPERATOR_DIFFERENCE,
    CAIRO_OPERATOR_EXCLUSION,
    CAIRO_OPERATOR_CLEAR,
    CAIRO_OPERATOR_SOURCE,
    CAIRO_OPERATOR_IN,
    CAIRO_OPERATOR_OUT,
    CAIRO_OPERATOR_ATOP,
    CAIRO_OPERATOR_DEST,
    CAIRO_OPERATOR_DEST_OVER,
    CAIRO_OPERATOR_DEST_IN,
    CAIRO_OPERATOR_DEST_OUT,
    CAIRO_OPERATOR_DEST_ATOP,
    CAIRO_OPERATOR_HSL_HUE,
    CAIRO_OPERATOR_HSL_SATURATION,
    CAIRO_OPERATOR_HSL_COLOR,
    CAIRO_OPERATOR_HSL_LUMINOSITY};

Screen::Screen()
{
    surface = cairo_image_surface_create(CAIRO_FORMAT_ARGB32, 128, 64);
    cr = cairo_create(surface);

    status = FT_Init_FreeType(&value);
    if (status != 0)
    {
        throw "ERROR (screen) freetype init";
    }

    strcpy(font_path[0], "04B_03__.TTF");
    strcpy(font_path[1], "liquid.ttf");
    strcpy(font_path[2], "Roboto-Thin.ttf");
    strcpy(font_path[3], "Roboto-Light.ttf");
    strcpy(font_path[4], "Roboto-Regular.ttf");
    strcpy(font_path[5], "Roboto-Medium.ttf");
    strcpy(font_path[6], "Roboto-Bold.ttf");
    strcpy(font_path[7], "Roboto-Black.ttf");
    strcpy(font_path[8], "Roboto-ThinItalic.ttf");
    strcpy(font_path[9], "Roboto-LightItalic.ttf");
    strcpy(font_path[10], "Roboto-Italic.ttf");
    strcpy(font_path[11], "Roboto-MediumItalic.ttf");
    strcpy(font_path[12], "Roboto-BoldItalic.ttf");
    strcpy(font_path[13], "Roboto-BlackItalic.ttf");
    strcpy(font_path[14], "VeraBd.ttf");
    strcpy(font_path[15], "VeraBI.ttf");
    strcpy(font_path[16], "VeraIt.ttf");
    strcpy(font_path[17], "VeraMoBd.ttf");
    strcpy(font_path[18], "VeraMoBI.ttf");
    strcpy(font_path[19], "VeraMoIt.ttf");
    strcpy(font_path[20], "VeraMono.ttf");
    strcpy(font_path[21], "VeraSeBd.ttf");
    strcpy(font_path[22], "VeraSe.ttf");
    strcpy(font_path[23], "Vera.ttf");
    //------------------
    // bitmap fonts
    strcpy(font_path[24], "bmp/tom-thumb.bdf");
    // FIXME: this is totally silly...
    int i = 25;
    strcpy(font_path[i++], "bmp/creep.bdf");
    strcpy(font_path[i++], "bmp/ctrld-fixed-10b.bdf");
    strcpy(font_path[i++], "bmp/ctrld-fixed-10r.bdf");
    strcpy(font_path[i++], "bmp/ctrld-fixed-13b.bdf");
    strcpy(font_path[i++], "bmp/ctrld-fixed-13b-i.bdf");
    strcpy(font_path[i++], "bmp/ctrld-fixed-13r.bdf");
    strcpy(font_path[i++], "bmp/ctrld-fixed-13r-i.bdf");
    strcpy(font_path[i++], "bmp/ctrld-fixed-16b.bdf");
    strcpy(font_path[i++], "bmp/ctrld-fixed-16b-i.bdf");
    strcpy(font_path[i++], "bmp/ctrld-fixed-16r.bdf");
    strcpy(font_path[i++], "bmp/ctrld-fixed-16r-i.bdf");
    strcpy(font_path[i++], "bmp/scientifica-11.bdf");
    strcpy(font_path[i++], "bmp/scientificaBold-11.bdf");
    strcpy(font_path[i++], "bmp/scientificaItalic-11.bdf");
    strcpy(font_path[i++], "bmp/ter-u12b.bdf");
    strcpy(font_path[i++], "bmp/ter-u12n.bdf");
    strcpy(font_path[i++], "bmp/ter-u14b.bdf");
    strcpy(font_path[i++], "bmp/ter-u14n.bdf");
    strcpy(font_path[i++], "bmp/ter-u14v.bdf");
    strcpy(font_path[i++], "bmp/ter-u16b.bdf");
    strcpy(font_path[i++], "bmp/ter-u16n.bdf");
    strcpy(font_path[i++], "bmp/ter-u16v.bdf");
    strcpy(font_path[i++], "bmp/ter-u18b.bdf");
    strcpy(font_path[i++], "bmp/ter-u18n.bdf");
    strcpy(font_path[i++], "bmp/ter-u20b.bdf");
    strcpy(font_path[i++], "bmp/ter-u20n.bdf");
    strcpy(font_path[i++], "bmp/ter-u22b.bdf");
    strcpy(font_path[i++], "bmp/ter-u22n.bdf");
    strcpy(font_path[i++], "bmp/ter-u24b.bdf");
    strcpy(font_path[i++], "bmp/ter-u24n.bdf");
    strcpy(font_path[i++], "bmp/ter-u28b.bdf");
    strcpy(font_path[i++], "bmp/ter-u28n.bdf");
    strcpy(font_path[i++], "bmp/ter-u32b.bdf");
    strcpy(font_path[i++], "bmp/ter-u32n.bdf");
    strcpy(font_path[i++], "bmp/unscii-16-full.pcf");
    strcpy(font_path[i++], "bmp/unscii-16.pcf");
    strcpy(font_path[i++], "bmp/unscii-8-alt.pcf");
    strcpy(font_path[i++], "bmp/unscii-8-fantasy.pcf");
    strcpy(font_path[i++], "bmp/unscii-8-mcr.pcf");
    strcpy(font_path[i++], "bmp/unscii-8.pcf");
    strcpy(font_path[i++], "bmp/unscii-8-tall.pcf");
    strcpy(font_path[i++], "bmp/unscii-8-thin.pcf");

    assert(i == NUM_FONTS);

    char filename[256];

    for (int i = 0; i < NUM_FONTS; i++)
    {
        status = snprintf(filename, 256, "/resources/%s", font_path[i]);
        if (status > 256)
        {
            fprintf(stderr, "ERROR (screen) path too long: %s\n", filename);
            throw "ERROR (screen) path too long";
        }

        status = FT_New_Face(value, filename, 0, &face[i]);
        if (status != 0)
        {
            fprintf(stderr, "ERROR (screen) font load: %s\n", filename);
            throw "ERROR (screen) font load";
        }
        else
        {
            ct[i] = cairo_ft_font_face_create_for_ft_face(face[i], 0);
        }
    }

    cairo_set_operator(cr, CAIRO_OPERATOR_CLEAR);
    cairo_paint(cr);
    cairo_set_operator(cr, CAIRO_OPERATOR_OVER);

    cairo_font_options_t *font_options = cairo_font_options_create();
    cairo_font_options_set_antialias(font_options, CAIRO_ANTIALIAS_GRAY);
    cairo_set_font_options(cr, font_options);
    cairo_font_options_destroy(font_options);

    cairo_set_font_face(cr, ct[0]);
    cairo_set_font_size(cr, 8.0);
}

Screen::~Screen()
{
    cairo_destroy(cr);
    cairo_surface_destroy(surface);
}

void Screen::save()
{
    cairo_save(cr);
}

void Screen::restore()
{
    cairo_restore(cr);
}

void Screen::font_face(int i)
{
    if ((i >= 0) && (i < NUM_FONTS))
    {
        cairo_set_font_face(cr, ct[i]);
    }
}

void Screen::font_size(double z)
{
    cairo_set_font_size(cr, z);
}

void Screen::aa(int s)
{
    cairo_font_options_t *font_options = cairo_font_options_create();
    if (s == 0)
    {
        cairo_set_antialias(cr, CAIRO_ANTIALIAS_NONE);
        cairo_font_options_set_antialias(font_options, CAIRO_ANTIALIAS_NONE);
    }
    else
    {
        cairo_set_antialias(cr, CAIRO_ANTIALIAS_DEFAULT);
        cairo_font_options_set_antialias(font_options, CAIRO_ANTIALIAS_GRAY);
    }
    cairo_set_font_options(cr, font_options);
    cairo_font_options_destroy(font_options);
}

void Screen::level(int z)
{
    if (z < 0)
    {
        z = 0;
    }
    else if (z > 15)
    {
        z = 15;
    }
    cairo_set_source_rgb(cr, c[z], c[z], c[z]);
}

void Screen::line_width(double w)
{
    cairo_set_line_width(cr, w);
}

void Screen::line_cap(std::string const &style)
{
    if (style == "round")
    {
        cairo_set_line_cap(cr, CAIRO_LINE_CAP_ROUND);
    }
    else if (style == "square")
    {
        cairo_set_line_cap(cr, CAIRO_LINE_CAP_SQUARE);
    }
    else
    {
        cairo_set_line_cap(cr, CAIRO_LINE_CAP_BUTT);
    }
}

void Screen::line_join(std::string const &style)
{
    if (style == "round")
    {
        cairo_set_line_join(cr, CAIRO_LINE_JOIN_ROUND);
    }
    else if (style == "bevel")
    {
        cairo_set_line_join(cr, CAIRO_LINE_JOIN_BEVEL);
    }
    else
    {
        cairo_set_line_join(cr, CAIRO_LINE_JOIN_MITER);
    }
}

void Screen::miter_limit(double limit)
{
    cairo_set_miter_limit(cr, limit);
}

void Screen::move(double x, double y)
{
    cairo_move_to(cr, x, y);
}

void Screen::line(double x, double y)
{
    cairo_line_to(cr, x, y);
}

void Screen::line_rel(double x, double y)
{
    cairo_rel_line_to(cr, x, y);
}

void Screen::move_rel(double x, double y)
{
    cairo_rel_move_to(cr, x, y);
}

void Screen::curve(double x1, double y1, double x2, double y2, double x3, double y3)
{
    cairo_curve_to(cr, x1, y1, x2, y2, x3, y3);
}

void Screen::curve_rel(double dx1, double dy1, double dx2, double dy2, double dx3, double dy3)
{
    cairo_rel_curve_to(cr, dx1, dy1, dx2, dy2, dx3, dy3);
}

void Screen::arc(double x, double y, double r, double a1, double a2)
{
    cairo_arc(cr, x, y, r, a1, a2);
}

void Screen::rect(double x, double y, double w, double h)
{
    cairo_rectangle(cr, x, y, w, h);
}

void Screen::close_path()
{
    cairo_close_path(cr);
}

void Screen::stroke()
{
    cairo_stroke(cr);
}

void Screen::fill()
{
    cairo_fill(cr);
}

void Screen::text(std::string const &s)
{
    cairo_show_text(cr, s.c_str());
}

void Screen::clear()
{
    cairo_set_operator(cr, CAIRO_OPERATOR_CLEAR);
    cairo_paint(cr);
    cairo_set_operator(cr, CAIRO_OPERATOR_OVER);
}

val Screen::text_extents(std::string const &s)
{
    cairo_text_extents_t extents;
    cairo_text_extents(cr, s.c_str(), &extents);
    text_xy[0] = extents.width;
    text_xy[1] = extents.height;
    return val(typed_memory_view(2, text_xy));
}

void Screen::rotate(double r)
{
    cairo_rotate(cr, r);
}

void Screen::translate(double x, double y)
{
    cairo_translate(cr, x, y);
}

void Screen::set_operator(int i)
{
    if (0 <= i && i <= 28)
    {
        cairo_set_operator(cr, ops[i]);
    }
}

val Screen::get_data()
{
    unsigned char *data = cairo_image_surface_get_data(surface);
    size_t size = sizeof(unsigned char) * 128 * 64 * 4;
    return val(typed_memory_view(size, data));
}
