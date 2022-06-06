---
layout: post
title:  "Add some keyboard shortcuts to make things faster/easier in OxygenBuilder"
date:   2022-06-4 00:00:00 +0800
category: oxygenbuilder
tags: oxygenbuilder js wordpress
---

Here's a script you can add to Code Snippets or your custom plugin to speed up your workflow.  

Gist here: [https://gist.github.com/pkboy/b556be63deb71edce22c34f2f238ccca](https://gist.github.com/pkboy/b556be63deb71edce22c34f2f238ccca)

## What is it?

I used JS and jQuery to add some shortcuts to the editor window. One is to move focus onto the class selector input so you can quickly type in the classes you want to add, and the other is to make the Add panel a popup.

### Click + Focus on Class Selector Input (ctrl + w)

> Ctrl + w

You know the deal, you click on an element and want to add some classes to it for styling or whatever and you have to move your mouse alllll the way from the element to the top left of the screen.  
*Save those wrists!* A quick hit of the shortcut and presto the input thing is selected. You still have to type out the class name though since it's not a true dropdown and I haven't thought about how to pick through the suggested classes.  

This is especially helpful for those using a utility-first CSS framework, just click on your thing and type in the classes.

### Add+ Element container popup (ctrl + q)

> Ctrl + q

In the same vein as above, it's about saving those mouse miles.  

Normally to add a new element, mouse allllll the way top left, and so on. At least your mouse would be in the same vicinity as the styles editor.  

## Installation

### Code Snippets

Stick that jQuery in between the script tags in the following snippet.

```php
add_action( "wp_head", "b58_add_scripts", 11);

function b58_add_scripts() {
	if( isset( $_GET['ct_builder'] ) && $_GET['ct_builder'] ) {
		$output = "<script>
    // CODE GOES HERE
		</script>";
		echo $output;
	}
}
```

### Plugin

Enqueue it in your plugin with with jQuery as a dependency and only add it like above.

## Customisation

You can change the keyboard shortcuts at lines 124 and lines 128 or in the ```keydown``` handler, look up the keycodes for your desired keys at a site like [https://www.toptal.com/developers/keycode](https://www.toptal.com/developers/keycode)

## Conclusion

If you have any questions you can DM me on twitter [@robchankh](https://twitter.com/robchankh) or leave a comment on FB where I'll post this.