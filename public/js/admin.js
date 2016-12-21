$(function() {


	$('.del').click(function(e) {
		$('#delmodal').modal('toggle')

		var target = $(e.target)
		var id = target.data('id')
		console.log(id)
		var tr = $('.item-id-' + id)

		$('#delmovie').click('click', function() {
			$('#delmodal').modal('hide')
			$.ajax({
				type: 'DELETE',
				datatype: 'JSON',
				url: '/admin/movie/list?id=' + id,
				success: function(res) {
					console.log(res)
					if (res.success === 1) {
						if (tr.length > 0) {
							tr.remove()
						}
					}

				}

			})
		})

	})



	$('#douban').blur(function() {
		var douban = $(this)
		var id = douban.val()
		if (id) {

			$.ajax({
				url: 'https://api.douban.com/v2/movie/subject/' + id,
				type: 'get',
				cache: true,
				dataType: 'JSONP', //请求返回来的数据格式
				crossDomain: true,
				jsonp: 'callback',
				success: function(data) {


					$('#inputName').val(data.title)
					$('#inputCategory').val(data.genres[0])
					$('#inputDoctor').val(data.directors[0].name)
					$('#inputCountry').val(data.countries[0])
						//$('#inputLanguage').val(data)
					$('#inputPoster').val(data.images.large)
					$('#inputYear').val(data.year)
					$('#inputSummary ').val(data.summary)

					var cat = $('#inputCategory').val()
					var l = $('.getradio').length
					console.log(cat)
					if (cat) {
						for (var i = 0; i < l; i++) {
							console.log($('.getradio').eq(i).next('span').text())
							if (cat === $('.getradio').eq(i).next('span').text()) {
								$('.getradio').eq(i).prop('checked', 'checked')

							} else {
								$('.getradio').prop('checked', false)
							}
						}

					}

				}


			})
		}



	})
})