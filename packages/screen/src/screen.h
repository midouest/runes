#pragma once

#include <emscripten/bind.h>
#include <emscripten/val.h>

#include <cairo.h>
#include <cairo-ft.h>

#include <string>

#define NUM_FONTS 67

using namespace emscripten;

class Screen
{
public:
    Screen();
    ~Screen();

    void save();
    void restore();
    void font_face(int i);
    void font_size(double z);
    void aa(int s);
    void level(int z);
    void line_width(double w);
    void line_cap(std::string const &style);
    void line_join(std::string const &style);
    void miter_limit(double limit);
    void move(double x, double y);
    void line(double x, double y);
    void line_rel(double x, double y);
    void move_rel(double x, double y);
    void curve(double x1, double y1, double x2, double y2, double x3, double y3);
    void curve_rel(double dx1, double dy1, double dx2, double dy2, double dx3, double dy3);
    void arc(double x, double y, double r, double a1, double a2);
    void rect(double x, double y, double w, double h);
    void close_path();
    void stroke();
    void fill();
    void text(std::string const &s);
    void clear();
    val text_extents(std::string const &s);
    void rotate(double r);
    void translate(double x, double y);
    void set_operator(int i);
    val get_data();

private:
    cairo_surface_t *surface;
    cairo_t *cr;

    cairo_font_face_t *ct[NUM_FONTS];
    FT_Library value;
    FT_Error status;
    FT_Face face[NUM_FONTS];
    char font_path[NUM_FONTS][32];
    double text_xy[2];
};

EMSCRIPTEN_BINDINGS(Screen)
{
    class_<Screen>("Screen")
        .constructor()
        .function("save", &Screen::save)
        .function("restore", &Screen::restore)
        .function("font_face", &Screen::font_face)
        .function("font_size", &Screen::font_size)
        .function("aa", &Screen::aa)
        .function("level", &Screen::level)
        .function("line_width", &Screen::line_width)
        .function("line_cap", &Screen::line_cap)
        .function("line_join", &Screen::line_join)
        .function("miter_limit", &Screen::miter_limit)
        .function("move", &Screen::move)
        .function("line", &Screen::line)
        .function("line_rel", &Screen::line_rel)
        .function("move_rel", &Screen::move_rel)
        .function("curve", &Screen::curve)
        .function("curve_rel", &Screen::curve_rel)
        .function("arc", &Screen::arc)
        .function("rect", &Screen::rect)
        .function("close_path", &Screen::close_path)
        .function("stroke", &Screen::stroke)
        .function("fill", &Screen::fill)
        .function("text", &Screen::text)
        .function("clear", &Screen::clear)
        .function("text_extents", &Screen::text_extents)
        .function("rotate", &Screen::rotate)
        .function("translate", &Screen::translate)
        .function("set_operator", &Screen::set_operator)
        .function("get_data", &Screen::get_data);
}
