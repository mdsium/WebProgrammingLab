<?php include 'config.php'; ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Book</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css">
</head>
<body class="p-4">
    <div class="container">
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-5">
                <div class="card">
                    <div class="card-header" style="display: flex; align-items: center; justify-content: space-between;">
                    <h4 class="">Add New Book</h4>
                    <a href="index.php" class="btn btn-success">HOME</a>
                    </div>
        <form action="" method="POST" enctype="multipart/form-data" class="card-body">
            <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input type="text" name="title" id="title" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="author" class="form-label">Author</label>
                <input type="text" name="author" id="author" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="genre" class="form-label">Genre</label>
                <input type="text" name="genre" id="genre" class="form-control">
            </div>
            <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input type="number" name="price" id="price" class="form-control" step="0.01" required>
            </div>
            <div class="mb-3">
                <label for="stock" class="form-label">Stock</label>
                <input type="number" name="stock" id="stock" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="book_image" class="form-label">Book Image</label>
                <input type="file" name="book_image" id="book_image" class="form-control" accept="image/*">
            </div>
            <button type="submit" name="submit" class="btn btn-primary">Add Book</button>
            <a href="view.php" class="btn btn-danger">Cancel</a>
        </form>
                </div>
            </div>
            <div class="col-md-3"></div>
        </div>
    </div>

    <?php
    if (isset($_POST['submit'])) {
        $title = $_POST['title'];
        $author = $_POST['author'];
        $genre = $_POST['genre'];
        $price = $_POST['price'];
        $stock = $_POST['stock'];

        // Handle image upload
        $imageName = null;
        if (!empty($_FILES['book_image']['name'])) {
            $targetDir = "uploads/uploads";
            $imageName = basename($_FILES['book_image']['name']);
            $targetFile = $targetDir . $imageName;
            $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

            // Validate file type
            $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
            if (!in_array($imageFileType, $allowedTypes)) {
                echo "<div class='alert alert-danger mt-3'>Invalid file type. Only JPG, JPEG, PNG, and GIF files are allowed.</div>";
                exit;
            }

            // Move uploaded file
            if (!move_uploaded_file($_FILES['book_image']['tmp_name'], $targetFile)) {
                echo "<div class='alert alert-danger mt-3'>Failed to upload image.</div>";
                exit;
            }
        }

        // Insert data into the database
        $sql = "INSERT INTO Books (Title, Author, Genre, Price, Stock, book_image) VALUES ('$title', '$author', '$genre', '$price', '$stock', '$imageName')";
        if ($conn->query($sql) === TRUE) {
            echo "<div class='alert alert-success mt-3'>Book added successfully.</div>";
        } else {
            echo "<div class='alert alert-danger mt-3'>Error: " . $conn->error . "</div>";
        }
    }
    ?>
</body>
</html>
