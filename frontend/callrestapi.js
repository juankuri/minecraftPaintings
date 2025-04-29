// URL de la API
var url = "http://localhost:3360/api/paintings";

$(document).ready(function() {
    console.log("Frontend is ready");

    $('#postPaintingButton').click(postPainting);
    $('#refreshPaintingsButton').click(getPaintings);
    $('#updatePaintingButton').click(updatePainting);
    $('#deletePaintingButton').click(deletePainting);
    $('#closeEditPanel').click(closeEditPanel);
    
    console.log("Button handlers configured");
    
    getPaintings();
});

function postPainting() {
    console.log("Posting painting:", url);
    
    if (!$('#name').val() || !$('#image_url').val() || !$('#artist').val()) {
        alert("Por favor completa todos los campos");
        return;
    }

    var myPainting = {
        name: $('#name').val(),
        image_url: $('#image_url').val(),
        artist: $('#artist').val()
    };

    console.log("Painting to post:", myPainting);

    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(myPainting),
        success: function (data) {
            console.log("Posted painting:", data);
            clearForm();
            getPaintings(); // Recargar la lista
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error posting painting:", textStatus, errorThrown);
            console.error("Response:", jqXHR.responseText);
            alert("Error al crear la pintura: " + (jqXHR.responseJSON?.message || textStatus));
        }
    });
}

function getPaintings() {
    console.log("Getting paintings from:", url);
    
    $('#paintings-container').html("<p class='loading'>Cargando pinturas...</p>");
    
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log("SUCCESS! Received paintings:", data);
            if (data.paintings && Array.isArray(data.paintings)) {
                $('#paintings-container').empty();
                
                if (data.paintings.length === 0) {
                    $('#paintings-container').html("<p class='no-results'>No hay pinturas registradas.</p>");
                    return;
                }
                
                console.log(`Found ${data.paintings.length} paintings`);
                data.paintings.forEach(displayPaintingCard);
            } else {
                console.error("Incorrect data structure:", data);
                $('#paintings-container').html("<p class='error'>Error: Estructura de datos incorrecta.</p>");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error getting paintings:", textStatus, errorThrown);
            console.error("Status code:", jqXHR.status);
            console.error("Response:", jqXHR.responseText);
            $('#paintings-container').html("<p class='error'>Error al obtener pinturas: " + textStatus + "</p>");
        }
    });
}

function displayPaintingCard(painting) {
    console.log("Displaying painting card:", painting);

    var paintingCard = `
        <div class="painting-card" data-name="${painting.name}" data-image="${painting.image_url}" data-artist="${painting.artist}">
            <div class="painting-img-container">
                <img src="${painting.image_url}" alt="${painting.name}" class="painting-image">
            </div>
            <div class="painting-info">
                <div class="painting-title">${painting.name}</div>
                <div class="painting-artist">${painting.artist}</div>
            </div>
        </div>
    `;
    $('#paintings-container').append(paintingCard);
    
    $('.painting-card').off('click').on('click', function() {
        var name = $(this).data('name');
        var imageUrl = $(this).data('image');
        var artist = $(this).data('artist');
        
        openEditPanel(name, imageUrl, artist);
    });
}

function updatePainting() {
    var paintingName = $('#edit-name').val();
    var myImageUrl = $('#edit-image-url').val();
    var myArtist = $('#edit-artist').val();
    console.log("Updating painting:", paintingName);
    
    if (!paintingName || !myImageUrl || !myArtist) {
        alert("Por favor completa todos los campos para actualizar");
        return;
    }

    var updatedPainting = {
        name: paintingName,
        image_url: myImageUrl,
        artist: myArtist
    };

    $.ajax({
        url: `${url}/${encodeURIComponent(paintingName)}`,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(updatedPainting),
        success: function(data) {
            console.log("Painting updated:", data);
            closeEditPanel();
            getPaintings(); // Refrescar lista
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error updating painting:", textStatus, errorThrown);
            console.error("Response:", jqXHR.responseText);
            
            if (jqXHR.status === 404) {
                alert("No se encontró ninguna pintura con ese nombre.");
            } else {
                alert("Error al actualizar la pintura.");
            }
        }
    });
}

function deletePainting() {
    var paintingName = $('#edit-name').val();
    console.log("Deleting painting:", paintingName);
    
    if (!paintingName) {
        alert("No se ha seleccionado ninguna pintura para eliminar");
        return;
    }

    if (!confirm(`¿Estás seguro que deseas eliminar la pintura "${paintingName}"?`)) {
        return;
    }

    $.ajax({
        url: `${url}/${encodeURIComponent(paintingName)}`,
        type: 'DELETE',
        success: function(data) {
            console.log("Painting deleted:", data);
            closeEditPanel();
            getPaintings(); // Refrescar lista
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error deleting painting:", textStatus, errorThrown);
            console.error("Response:", jqXHR.responseText);
            
            if (jqXHR.status === 404) {
                alert("No se encontró ninguna pintura con ese nombre.");
            } else {
                alert("Error al eliminar la pintura.");
            }
        }
    });
}

function clearForm() {
    $('#name').val('');
    $('#image_url').val('');
    $('#artist').val('');
}

function openEditPanel(name, imageUrl, artist) {
    $('#edit-name').val(name);
    $('#edit-image-url').val(imageUrl);
    $('#edit-artist').val(artist);
    
    $('#edit-panel').css('display', 'flex');
}

function closeEditPanel() {
    $('#edit-panel').css('display', 'none');
}