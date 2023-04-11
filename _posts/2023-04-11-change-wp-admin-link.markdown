---
layout: post
title:  "Change 'Exit to' WP Admin Link in Oxygen Builder"
date:   2023-04-11 00:00:00 +0800
category: oxygenbuilder
tags: oxygenbuilder php js wordpress
---

Recent post on FB ([link](https://www.facebook.com/groups/1626639680763454/posts/6021507501276628/)) asked how to change the Exit links in the Oxygen Builder.

I can see the utility changing the link if your site doesn't utilise WP's edit page for your content. Or if you're editing templates where you generally don't need to go to the edit page.

So here's a snippet for changing the link.

```php
<?php
add_action('wp_head', function () {
  // get edit page
  if (!isset($_GET['ct_builder'])) return;
  $curr_post_type = get_post_type();
  if (!$curr_post_type) return;
  $admin_post_list = add_query_arg('post_type', $curr_post_type, admin_url('edit.php'));
?>
  <script>
    addEventListener("load", () => {
      var interval;
      interval = setInterval(() => {
        const link = document.querySelector(".oxygen-toolbar-button-dropdown a");
        if (link && link.href) {
          link.href = <?= json_encode($admin_post_list); ?>;
          clearInterval(interval);
        }
      }, 500);
    });
  </script>
<?php
});


```

Here's what is does:
1.	This function is called on the ```wp_head``` hook, which outputs the contents inside the ```<head>``` tag of a page.
2.	Checks if Oxygen Builder's editor is being loaded, if not then do nothing.
3.	Gets the current post type that was requested, if no post type then do nothing.
4.	If there is a post type it generates the URL that the "WP Admin" link should go back to.
5.	Inserts JS into the page's ```<head>```.
6.	The JS checks for the existence of the first ```<a>``` inside the ```.oxygen-toolbar-button-dropdown``` element, explanation below.
7.	When that link is available, it changes the link to the one generated in step 4.

## PHP

Some checks to ensure we're actually in the builder and that there is a link to be generated.  

The format of the link for the list of pages/posts is ```admin_url/wp-admin/?post_type=POST_SLUG```.

## Javascript

The JS is ran after the page's content is loaded (mostly), you could run it on ```DOMContentLoaded``` but for this type of script you want to delay its execution and the ```load``` event occurs after the ```DOMContentLoaded```.  
  
Since the builder gets loaded via JS, some elements might not be available when we run our own script, so here we just set an interval that runs every 500 milliseconds that checks for the existence of a link inside the ```.oxygen-toolbar-button-dropdown``` containter.  
  
When it is created, our script modifies the location of the link to the post list page rather than the single post edit page.


### Notes

Works going back to Oxygen Template list, Custom Post Types, WP Posts, and Pages.

Tested in Chrome / Firefox.

## Conclusion

If you have any questions you can DM me on twitter [@robchankh](https://twitter.com/robchankh) or leave a comment on FB where I'll post this.