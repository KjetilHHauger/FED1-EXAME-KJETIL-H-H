# FED1-EXAME-KJETIL-H-H

# Brickify LEGO Blog

Welcome to the Brickify LEGO blog, a dynamic web application designed for LEGO enthusiasts. This blog features advanced functionalities including pagination, a search filter, a carousel for latest posts, and user authentication for blog management.

## Features

- **Pagination**: Automatically paginates the main page to show no more than 12 posts at a time.
- **Carousel**: Displays the latest three posts with a prev/next button and navigation dots.
- **Search Functionality**: Allows users to search for blog posts based on titles.
- **Tag Filtering**: Users can filter posts by tags to easily find related content.
- **Single Post View**: Clicking on a post opens a detailed view (`/post/index.html`) that includes the title, image, text, author, publish date, and tags.
- **User Authentication**: Secure login and registration system for blog management.
- **Post Management**: Authenticated users can create, edit, and delete posts through `/post/edit.html` with required field validations and a character count feature.

## Design

View the design prototype on Figma here: [View Figma Design](https://www.figma.com/design/hYvyeaPiUNAysrPvs4vJPT/Brickify?node-id=2-10&t=ZzkqrfGnbHZuUROY-1).


## Live Demo

You can view the live version of the Brickify LEGO blog hosted on Netlify at [Brickify Blog](https://khh-bloggie.netlify.app/).

## Project Structure

/
|- index.html # Main page with post listings, pagination, and carousel
|- post/index.html # Detailed post view
|- account/
| |- login.html # Login page for blog management
| |- register.html # Registration page for new users
| |- edit.html # Post editing interface


## Setup and Installation

No installation is required to view the live demo. However, if you wish to run the project locally or contribute, you may clone the repository using the following command:

## Contributing
Contributions are welcome! If you have suggestions or enhancements, please fork the repository and submit a pull request with your changes. Please ensure all contributions adhere to the existing design and functional specifications.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

