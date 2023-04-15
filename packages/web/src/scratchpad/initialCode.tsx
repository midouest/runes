export const initialCode = `-- DON'T set global variables here
-- norns libraries: screen, util

function init()
  -- DO set global variables here
  -- press the init buttons to reset variables
end

function key(n, z)
  -- called when a key is pressed or released
end

function enc(n, d)
  -- called when an encoder is turned
end

function redraw()
  -- update screen on each change
  screen.clear()

  -- change numeric value under cursor using:
  -- ctl/cmd + alt/opt + equal (+1)
  -- ctl/cmd + alt/opt + minus (-1)
  -- ctl/cmd + alt/opt + shift + equal (+10)
  -- ctl/cmd + alt/opt + shift + minus (-10)
  screen.move(64, 32)
  screen.level(15)
  screen.text_center("Welcome to Runes!")
  screen.stroke()

  screen.update()
end`;
