(function() {

	/* ======== View ======== */

	const view = {
		init: function() {
			const attendance = octopus.fetchAttendance();
			
			$.each(attendance, function(name, days) {		
				const checkboxes = $(`.name-col:contains("${name}")`).siblings('.attend-col').children();
				checkboxes.each(function(i, box) {
					$(box).prop('checked', days[i]);
				})
			});
			view.displayMissed();
			$('input').click(function(e) {
				view.displayMissed();

				$.each(attendance, function(name, days) {
					const checkboxes = $(`.name-col:contains("${name}")`).siblings('.attend-col').children(),
						checks = [];
					checkboxes.each(function() {
						checks.push($(this).prop('checked'));
					});
					attendance[name] = checks;
				});
				octopus.updateAttendance(attendance);
			});
		},

		getNameCols: function() {
			return $('td.name-col')
		},

		displayMissed: function() {
			const missedCols = $('tbody .missed-col');
			missedCols.each(function() {
				let count = 0,
					boxes = $(this).siblings('.attend-col').children();
				boxes.each(function() {
					if($(this).prop('checked') == true) {
						count++;
					}
				});

				$(this).text(count);
			});
		}
	}


	/* ======== Octopus ======== */

	const octopus = {
		init: function() {
			model.init();
			view.init();
		},

		fetchNameCols: function() {
			return view.getNameCols();
		},

		fetchAttendance: function() {
			return JSON.parse(localStorage.attendance);
		},

		updateAttendance: function(attendance) {
			localStorage.attendance = JSON.stringify(attendance);
		}
	}


	/* ======== Model ======== */

	const model = {
		init: function() {
			if(!localStorage.attendance) {
				console.log("Creating attendance log");
				let attendance = {},
					nameCols = octopus.fetchNameCols();
				function randomBoolean() {
					return (Math.random() >= 0.5);
				}

				nameCols.each(function() {
					let name = $(this).text();
					attendance[name] = [];

					for(i=1; i<=12; i++) {
						attendance[name].push(randomBoolean());
					}
				})
				localStorage.attendance = JSON.stringify(attendance);
			}
		}
	}

	octopus.init();
})();