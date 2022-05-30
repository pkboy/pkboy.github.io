---
layout: post
title:  "Replicate default Wordpress /embed post feature"
date:   2022-05-30 00:00:00 +0800
category: oxygenbuilder
tags: oxygenbuilder php wordpress
---
OxygenBuilder disables the Wordpress theme and renders content using its own templates, so if something isn't created for a specific content type, Oxygen will render the page using the catch-all template.

This is fine for most cases, except when you want it to embed a post.

Generally when you have the permalink for a post and add "/embed" or "/embed/" to the URL, WP will use a secondary embed template to render that post's content, and conveniently it's usually just the post's title (with link) and the featured image. But when /embed is requested with Oxygen, it doesn't know where to look so it goes to the catch-all template which makes it... render the whole page, which isn't the desired behaviour unless you want a whole page to be embedded inside another page.

If you require this functionality, we can achieve this with some code.



___

> This guide assumes some basic knowledge of Wordpress and Oxygen Builder

## The Process

1.	Create template for normal content.
2.	Create template for content when it is being embedded.
3.	Write some custom PHP.
4.	Create template that will only have a shortcode element which picks either template made in 1 or 2 based on the URL.

## Templates

### First one, the full post template

Create the normal template for your Single post content, you know with Title, Featured Image, Content, etc. Make this priority 0. Inherit the main template with your menus and whatever here.

### Second one, the embed post template

Create a template for the embedded content. This will be the div that is embedded where ever, like in the middle of another post's content, so make it simple maybe just the Title as a link + featured image. Also make this priority 0.

Don't inherit the main template with the menus here unless you want your embedded post to have the menus.

### PHP

There are 2 functions in this PHP.

First function checks to see if the string "embed" is at the end of the permalink for the current post.

<div class="toggle" markdown="1">
#### is_embed_element function
</div>

```php
function is_embed_element() {
	$queried = get_queried_object();
	if( get_class( $queried ) === 'WP_Post' ) {
		global $wp;
		$requested_url = home_url( $wp->request );
		$permalink = get_permalink( $queried );
		$found_embed = strpos( $requested_url, 'embed', strlen($permalink) );
		return $found_embed;
	} else {
		return false;
	}
}
```

The second function will be used as a shortcode. This function basically loads either the full post template or the embed post template based on the result of the ```is_embed_element``` function.

<div class="toggle" markdown="1">
#### oxy_get_post_template function
</div>

```php
function oxy_get_post_template() {
	$template_id = -1;
	
	if ( is_embed_element() ) {
		// embed is in this URL, likely not as part of another word...
		// get this template's json and return it.
		$template_id = 133;
	} else {
		// no embed found at end of URL so this is the template ID for the Full Post template.
		$template_id = 134;
	}
	
	$json = oxygen_get_combined_tree( $template_id );
	
	global $oxygen_doing_oxygen_elements;
	$oxygen_doing_oxygen_elements = true;
	$result = do_oxygen_elements($json);
	$oxygen_doing_oxygen_elements = false;
	return $result;
}

// Add this shortcode.

add_shortcode( 'oxy-get-post-template', 'oxy_get_post_template' );

```

Most of the code I got from looking through Oxygen's source code, if someone more knowledgable or official can correct me on it I'll update this post.

To get the ID for either the Full Post or Embed Post template you go to their edit pages and the post ID should be at the top.

| ![Oxygen Template ID](/assets/img/oxy-template-id.png)|
|:--:|
| Oxygen Template ID |

### The 3rd Template, THE DECIDER

Create a 3rd template, make it for Single Post like the other two. Give it a higher priority than the other 2, so 1.
In this template, just add a Shortcode element, the shortcode will be  
  
```[oxy-get-post-template]```
  
Now any requests for single posts will get checked if "embed" is at the end of the URL. If it is, it'll render the content using the Embed Post Template. If it isn't then it'll use the Full Post Template.

| ![Shortcode Element](/assets/img/oxy-embed-shortcode.png)|
|:--:|
| Shortcode Element |

If you use WP's Gutenberg to Embed a post via Permalink, it'll render using the Embed Post Template.

See example here: [http://thathappenedto.us/2022/05/test/](http://thathappenedto.us/2022/05/test/)  
Then if you want to see what the Embed looks like [http://thathappenedto.us/2022/05/test/embed/](http://thathappenedto.us/2022/05/test/embed/)

| ![The Links are Embedded](/assets/img/oxy-embed-block.png)|
|:--:|
| The Links are Embedded |

## Issues

*		As I said, just doing this by following Oxygen's code in their plugin so I'm not 100% sure this is the correct way of doing it.

*		Code has not been thoroughly tested, haven't accounted for URLs that follow different permalink pattern, or checked to see if any adverse effects can occur due to changing the ```$oxygen_doing_oxygen_elements``` variable, but I turned it on and off in the code.

*		Use at own risk, can probably add more checks for ```post_types``` and other checks to ensure it won't break anything.

## Conclusion

Credit to Supa Mike's post about multiple headers for Polylang [https://oxygen4fun.supadezign.com/tutorials/how-to-have-different-menus-with-polylang/](https://oxygen4fun.supadezign.com/tutorials/how-to-have-different-menus-with-polylang/) for seeding the idea of using a shortcode to render different content.

If you have any questions you can DM me on twitter [@robchankh](https://twitter.com/robchankh) or leave a comment on FB where I'll post this.