# library(golem)
# options(shiny.port = 1234)
# options(shiny.host = '0.0.0.0')
# BIGapp::run_app()

local_lib <- file.path(dirname(R.home()), "library")  

.libPaths(c(local_lib, .libPaths()))
print(.libPaths())


print("BIGapp version is:")
print(packageDescription("BIGapp")$Version)

library(golem)

# Remove fixed port assignment
# options(shiny.port = 1234)
options(shiny.host = '127.0.0.1') # Use localhost for security

# Run the Shiny app and capture the selected port
shiny_port <- httpuv::randomPort()

# Output the selected port to stdout
cat(sprintf("Selected port: %d\n", shiny_port))

# Run the app on the selected port
BIGapp::run_app(options = list(port = shiny_port, launch.browser = FALSE))
