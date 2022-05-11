---
layout: post
title:  "Create Tabs for Categories and their content"
date:   2022-05-11 00:00:30 +0800
category: oxygenbuilder
tags: oxygenbuilder css js wordpress
---

OxygenBuilder's Repeater works with the WP_Query class to retrieve post objects and spits them out in a loop.  
However, it does not support other classes like WP_Term_Query or WP_User_Query that can query taxonomies and users respectively.

Users commonly want to show a list of categories or tags and their contents.  
Oxygen has some support to handle these, but they are pretty basic and just call WP's built in functions like ```get_the_category``` and ```get_categories```

So here we will use a repeater, some JS and CSS to build out an element that has the different categories in tabs and a collection of their posts inside each tab.  

Here is the demo of the thing [http://thathappenedto.us/repeater-for-category/](http://thathappenedto.us/repeater-for-category/)

## The Process

This tutorial will take all the posts from your site using the repeater and add some meta-data to each repeated div then use Javascript to re-order the items.  

1.  Repeater fetches all the posts. For each post add a data attribute with their tags.
2.  Use JS to create tabs + tab content.
3.  Loop through the categories and find all posts from the Repeater and copy it into their tab.

It is basically the same as the [Repeater Menu]({% link _posts/2022-04-18-menu-with-repeater-oxygenbuilder.markdown %}) tutorials.

### The PHP

We only need to write 1 external PHP function for this.  
This is the function

<div class="toggle" markdown="1">
#### get_csv_categories function
</div>

```php
function get_csv_categories() {
	$result = array();
	foreach((get_the_category()) as $category){
		$result[] = rawurlencode('\"'.$category->name.'\"');
	}
	return implode( ',', $result );
}
```

It gets a list categories for a post and returns it as a single comma separated string.  
URLEncoded because the categories may contain commas, spaces, or other characters.

### The Repeater

We'll use the Repeater to fetch all the items we need, so in this case all the items of ```post_type``` ```post```.  
So add a repeater to your page, and use the Advanced Query to get all published posts and ```posts_per_page``` as *-1* to get all posts.

Set some ID for your repeater, this will be used to select the items needed from it.  

For the main repeated div, add a data-attribute named ```data-categories``` and its value will be a Dynamic Data -> PHP Function Return Value.  
The function name will be ```get_csv_categories```

This data attribute will have a value like "Sports,News,Programming,Gossip,Finance".

Then add the headings / text or whatever you want to the div.

### Other bits

Add a div to your page, give it a class ```tab-div``` and put it whereever, this is where everything will go in.  

### The Code Block

Here it is if you just want to glance through it, I'll go over each part after.

<div class="toggle" markdown="1">
#### PHP / HTML Code Block
</div>

```js
<?php
$args = array(
  'type'                     => 'post',
  'orderby'                  => 'name',
  'order'                    => 'ASC',
  'hide_empty'               => 1);
$categories = get_categories( $args );
$cat_str_array = array_map(function ($cat) { return " \"".$cat->name ."\""; }, $categories);
$cat_str = implode(',', $cat_str_array);
?>
<script>
  jQuery(($) => {
    // setup tabs and containers
    const cat_names = [<?php echo print_r( $cat_str, true); ?>]

    // create containers.
    const tabDiv = $('.tab-div')
    
    const tabsContainer = $('<div>', {
      class: 'tabs-container'
    })
    tabsContainer.appendTo(tabDiv)
    
    const tabContentContainer = $('<div>', {
      class: 'tab-content-container'
    })
    tabContentContainer.appendTo(tabDiv)

    cat_names.forEach((cat, i) => {
      const active = i == 0 ? ' active' : ''
      
      const newTab = $('<div>', {
        class: 'tab' + active,
        title: cat,
        'data-tab-for': cat
      })
      
      const tabTitle = $('<div>', {
        class: 'tab-title'
      })
      tabTitle.text(cat)
      
      tabTitle.appendTo(newTab)
      newTab.appendTo(tabsContainer)

      const tabContents = $('<div>', {
        class: 'tab-contents' + active,
        title: cat + ' contents',
        'data-contents-for': cat
      })

      // tabs are set. Now find the relevant items from the repeater and move into this tabContents
      // container
      tabContents.append(
        $('#repeater-contents > div[data-categories*=\''+encodeURI(cat)+'\']').clone())
      
      tabContents.appendTo(tabContentContainer)
    })
    
    // setup click handlers
    $('.tab').on('click', (event) => {
      const clicked = $(event.delegateTarget)
      $('.tab').each((i, ele) => {
        if($(ele).hasClass('active')) {
          $(ele).removeClass('active')					
        }
      })
      
      clicked.addClass('active')
      
      $('.tab-contents').each((i, ele) => {
        if($(ele).data('contentsFor') == clicked.data('tabFor')) {
          $(ele).addClass('active')
        } else {
          $(ele).removeClass('active')					
        }
      })
      event.preventDefault()
    })
  })
</script>
```

That's the whole thing. Now for the individual bits.

#### The PHP

```php
	$args = array(
		'type'                     => 'post',
		'orderby'                  => 'name',
		'order'                    => 'ASC',
		'hide_empty'               => 1);
	$categories = get_categories( $args );
	$cat_str_array = array_map(function ($cat) { return " \"".$cat->name ."\""; }, $categories);
	$cat_str = implode(',', $cat_str_array);
	?>
  ...
  const cat_names = [<?php echo $cat_str; ?>]
```

Here we get a list of all the post categories, minus the empty ones, and echo it into a JS array.

#### The jQuery

```js
  const cat_names = [<?php echo print_r( $cat_str, true); ?>]

  // create containers.
  const tabDiv = $('.tab-div')
  const tabsContainer = $('<div>', {
    class: 'tabs-container'
  })
  tabsContainer.appendTo(tabDiv)
  const tabContentContainer = $('<div>', {
    class: 'tab-content-container'
  })
  tabContentContainer.appendTo(tabDiv)
```

Here we set up the different containers for the elements, ```tab-div``` is the main div that was created earlier.  
```tabs-container``` will contain the individual tabs.  
```tab-content-container``` will contain the content.

The 2 containers are added to the main div.


```js
  cat_names.forEach((cat, i) => {
```

We loop through all the categories we got at the start of the code block.

```js
  // set the first item as active
  const active = i == 0 ? ' active' : ''

  const newTab = $('<div>', {
    class: 'tab' + active,
    title: cat,
    'data-tab-for': cat
  })

  const tabTitle = $('<div>', {
    class: 'tab-title'
  })
  tabTitle.text(cat)

  tabTitle.appendTo(newTab)
  newTab.appendTo(tabsContainer)
```

1.  Create each individual tab, assign it the ```tab``` class.  
2.  Add ```active``` if it's the first item.
3.  Add ```data-tab-for``` attribute in order to keep track of this.  
4.  Set the title of this tab to be the name of the category.
5.  Add this new tab to the tabs container.

```js
    const tabContents = $('<div>', {
      class: 'tab-contents' + active,
      title: cat + ' contents',
      'data-contents-for': cat
    })

    // tabs are set. Now find the relevant items from the repeater and move into this tabContents
    // container. encodeURI because the contents are URL encoded from the back-end.
    // we use Clone because append on its own will move the items which means items
    // with multiple categories won't make it to the 2nd tab.
    tabContents.append(
      $('#repeater-contents > div[data-categories*=\''+encodeURI(cat)+'\']').clone())
    
    tabContents.appendTo(tabContentContainer)
  })
```

1.  Create div for the tab contents.
2.  Add data attribute to keep track of which category this is for.
3.  Select all the entries that have this category in the ```data-categories``` attribute. Using ```*=``` matches *any where* in the value.
4.  Append the results to the newly create contents div.

```js			
    // setup click handlers
    $('.tab').on('click', (event) => {
      const clicked = $(event.delegateTarget)
      $('.tab').each((i, ele) => {
        if($(ele).hasClass('active')) {
          $(ele).removeClass('active')					
        }
      })
      
      clicked.addClass('active')
      
      $('.tab-contents').each((i, ele) => {
        if($(ele).data('contentsFor') == clicked.data('tabFor')) {
          $(ele).addClass('active')
        } else {
          $(ele).removeClass('active')					
        }
      })
      event.preventDefault()
    })
  })
</script>
  ```

Basic event handling, adds the ```active``` class to the clicked ```tab``` and the associated ```tab-content``` div.  
The CSS will handle the rest.

#### The CSS

This is just some basic CSS used in the demo, you can add your transitions and animations here or in the click event handler if that's your thing.  
You can also change the flex direction and some other CSS and have tabs on the side.

<div class="toggle" markdown="1">
#### Some CSS
</div>

```css
.tab {
	cursor: pointer;
	padding: 6px 12px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	font-style: oblique;
	background-color: rosybrown;
}

.tab:hover {
	background-color: sandybrown;
}

.tabs-container {
	display: flex;
	align-items: flex-end;
}

.active.tab {
	background-color: indianred;
	color: white;
	padding-bottom: 12px;
}

.tab-contents {
	display: none;
	flex-direction: column;
	padding: 24px;
	width: 100%;
	font-size: 1.4rem;
	transition: opacity 1s ease-out;
}

.tab-contents a {
	text-decoration: underline;
	color: white;
}

.active.tab-contents {
	display: flex;
}

.tab-content-container {
	width: 100%;
	background-color: chocolate;
}
```

#### Other Styles

You can do glossary type pages if you modify the process a little bit.

| ![Glossary type listing](/assets/img/glossary.jpg)|
|:--:|
| Glossary type listing |

Changed the js like so

<div class="toggle" markdown="1">
####  Glossary JS
</div>

```js
<?php
	$args = array(
		'type'                     => 'post',
		'orderby'                  => 'name',
		'order'                    => 'ASC',
		'hide_empty'               => 1);
	$categories = get_categories( $args );
	$cat_str_array = array_map(function ($cat) { return " \"".$cat->name ."\""; }, $categories);
	$cat_str = implode(',', $cat_str_array);
	?>
	<script>
		jQuery(($) => {
			// setup tabs and containers
			const cat_names = [<?php echo $cat_str; ?>]

			// create containers.
			const glossary = $('.glossary-div')
			
			const glossaryContainer = $('<div>', {
				class: "glossary-content-container"
			})
			glossaryContainer.appendTo(glossary)

			cat_names.forEach((cat, i) => {
				
				const newCatContainer = $('<div>', {
					class: 'cat-container',
					title: cat
				})
				
				const newHeading = $('<div>', {
					class: 'heading',
					title: cat,
					'data-heading-for': cat
				})
				
				newHeading.text(cat)
				newHeading.appendTo(newCatContainer)

				newCatContainer.append(
					$('#glossary-repeater > div[data-categories*=\''+encodeURI(cat)+'\']').clone())
				
				newCatContainer.appendTo(glossaryContainer)
			})
			
		})
	</script>
```

And the CSS like so

<div class="toggle" markdown="1">
####  Glossary CSS
</div>

```css
.glossary-content-container {
	display: flex;
	flex-flow: row wrap;
}

.cat-container {
	display: flex;
	flex-flow: column wrap;
	flex-wrap: wrap;
	width: 30%;
	margin-right: 1rem;
}

.cat-container > .heading {
	font-size: 1.2rem;
	font-weight: 600;
	border-bottom: solid 2px lightgrey;
	margin-top: 1rem;
	margin-bottom: 1rem;
}
```

Note the change in the div names but I just copied the section and changing the code took like 2minutes.

#### Issues / Problems

*   Duplication - Notice I used clone() to ensure that items that appear under multiple categories are listed under both those categories. This means the repeater will still be in the DOM with all the posts, even if you remove() it it will still have taken up some bandwidth. You could keep track of each item and don't clone the last instance of it but that's a bit much.

*   Pagination - Works but you have to hide the repeater divs but show the last div (the element that has the pagination links)

Actually for I was curious about pagination and did it with the following changes and it works

| ![Glossary type listing](/assets/img/glossary-pagination.jpg)|
|:--:|
| Glossary type listing |

<div class="toggle" markdown="1">
####  Glossary JS for pagination
</div>

```js
<?php
	$args = array(
		'type'                     => 'post',
		'orderby'                  => 'name',
		'order'                    => 'ASC',
		'hide_empty'               => 1);
	$categories = get_categories( $args );
	$cat_str_array = array_map(function ($cat) { return " \"".$cat->name ."\""; }, $categories);
	$cat_str = implode(',', $cat_str_array);
	?>
	<script>
		jQuery(($) => {
			// setup tabs and containers
			const cat_names = [<?php echo $cat_str; ?>]

			// create containers.
			const tabDiv = $('.tab-div')
			
			const tabsContainer = $('<div>', {
				class: "tabs-container"
			})
			tabsContainer.appendTo(tabDiv)
			
			const tabContentContainer = $('<div>', {
				class: "tab-content-container"
			})
			tabContentContainer.appendTo(tabDiv)

			cat_names.forEach((cat, i) => {
				const active = i == 0 ? ' active' : ''
				
				const newTab = $('<div>', {
					class: 'tab' + active,
					title: cat,
					'data-tab-for': cat
				})
				
				const tabTitle = $('<div>', {
					class: 'tab-title'
				})
				tabTitle.text(cat)
				
				tabTitle.appendTo(newTab)
				newTab.appendTo(tabsContainer)

				const tabContents = $('<div>', {
					class: 'tab-contents' + active,
					title: cat + ' contents',
					'data-contents-for': cat
				})

				// tabs are set. Now find the relevant items from the repeater and move into this tabContents
				// container
				tabContents.append(
					$('#repeater-contents > div[data-categories*=\''+encodeURI(cat)+'\']').clone())
				
				tabContents.appendTo(tabContentContainer)
			})
			
			// setup click handlers
			$('.tab').on('click', (event) => {
				const clicked = $(event.delegateTarget)
				$('.tab').each((i, ele) => {
					if($(ele).hasClass('active')) {
						$(ele).removeClass('active')					
					}
				})
				
				clicked.addClass('active')
				
				$('.tab-contents').each((i, ele) => {
					if($(ele).data('contentsFor') == clicked.data('tabFor')) {
						$(ele).addClass('active')
					} else {
						$(ele).removeClass('active')					
					}
				})
				event.preventDefault()
			})
			
		})
	</script>
```


<div class="toggle" markdown="1">
####  Glossary CSS for pagination
</div>

```css
.tab-div {
	flex-direction: column;
}

.tab {
	cursor: pointer;
	padding: 6px 12px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	font-style: oblique;
	background-color: rosybrown;
}

.tab:hover {
	background-color: sandybrown;
}

.tabs-container {
	display: flex;
	align-items: flex-end;
}

.active.tab {
	background-color: indianred;
	color: white;
	padding-bottom: 12px;
}

.tab-contents {
	display: none;
	flex-direction: column;
	padding: 24px;
	min-height: 50vh;
	width: 100%;
	font-size: 1.4rem;
	transition: opacity 1s ease-out;
}

.tab-contents a {
	text-decoration: underline;
	color: white;
}

.active.tab-contents {
	display: flex;
}

.tab-content-container {
	width: 100%;
	background-color: chocolate;
}
```

### End

And again here is the demo: [http://thathappenedto.us/repeater-for-category/](http://thathappenedto.us/repeater-for-category/)

As usual this thing hasn't been thoroughly tested by myself.  
If you have any questions you can DM me on twitter [@robchankh](https://twitter.com/robchankh) or leave a comment on FB where I'll post this.