import sys
import os
import argparse
import time

try:
    import pyautogui
    import mss
    import mss.tools
    from PIL import Image
except ImportError as e:
    print(f"Missing dependency: {e}")
    sys.exit(1)

# Fail-safe settings (disabled to allow moving from (0,0) edge)
pyautogui.FAILSAFE = False
pyautogui.PAUSE = 0.05

def get_screen_size():
    size = pyautogui.size()
    print(f"SCREEN_SIZE:{size.width}x{size.height}")
    return size

def take_screenshot(output_path="screen.png"):
    with mss.mss() as sct:
        monitor = sct.monitors[1]  # primary monitor
        sct_img = sct.grab(monitor)
        mss.tools.to_png(sct_img.rgb, sct_img.size, output=output_path)
    print(f"SCREENSHOT_SAVED:{output_path}")

def get_mouse_pos():
    x, y = pyautogui.position()
    print(f"MOUSE_POS:{x},{y}")
    return x, y

def move_mouse(x, y, duration=0.2):
    pyautogui.moveTo(x, y, duration=duration)
    print(f"MOUSE_MOVED:{x},{y}")

def click(x=None, y=None, button="left", clicks=1):
    if x is not None and y is not None:
        pyautogui.click(x=x, y=y, button=button, clicks=clicks)
    else:
        pyautogui.click(button=button, clicks=clicks)
    print(f"CLICKED:{button} clicks={clicks} at={x},{y}")

def write_text(text, interval=0.02):
    pyautogui.write(text, interval=interval)
    print(f"TYPED_TEXT:{len(text)} characters")

def press_key(key):
    pyautogui.press(key)
    print(f"KEY_PRESSED:{key}")

def hotkey(*keys):
    pyautogui.hotkey(*keys)
    print(f"HOTKEY:{'+'.join(keys)}")

def main():
    parser = argparse.ArgumentParser(description="Desktop GUI Automation Controller")
    subparsers = parser.add_subparsers(dest="action")

    # Screen
    subparsers.add_parser("size")
    screen_parser = subparsers.add_parser("screenshot")
    screen_parser.add_argument("--out", default="screen.png")

    # Mouse
    subparsers.add_parser("pos")
    move_parser = subparsers.add_parser("move")
    move_parser.add_argument("x", type=int)
    move_parser.add_argument("y", type=int)

    click_parser = subparsers.add_parser("click")
    click_parser.add_argument("--x", type=int, default=None)
    click_parser.add_argument("--y", type=int, default=None)
    click_parser.add_argument("--button", default="left", choices=["left", "right", "middle"])
    click_parser.add_argument("--clicks", type=int, default=1)

    # Keyboard
    type_parser = subparsers.add_parser("type")
    type_parser.add_argument("text")

    key_parser = subparsers.add_parser("press")
    key_parser.add_argument("key")

    hotkey_parser = subparsers.add_parser("hotkey")
    hotkey_parser.add_argument("keys", nargs="+")

    args = parser.parse_args()

    if args.action == "size":
        get_screen_size()
    elif args.action == "screenshot":
        take_screenshot(args.out)
    elif args.action == "pos":
        get_mouse_pos()
    elif args.action == "move":
        move_mouse(args.x, args.y)
    elif args.action == "click":
        click(args.x, args.y, args.button, args.clicks)
    elif args.action == "type":
        write_text(args.text)
    elif args.action == "press":
        press_key(args.key)
    elif args.action == "hotkey":
        hotkey(*args.keys)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
