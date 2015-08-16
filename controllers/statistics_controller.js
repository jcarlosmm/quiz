var models = require('../models/models.js');

// GET /statistics
exports.index = function(req, res, next) {
    models.Quiz.count().then(
      function(totalPreguntas) {

        models.Comment.count().then(
          function(totalComentarios) {

            // Anidamiento necesario para que se puedan leer, en esta búsqueda por "findAll", los valores devueltos por las anteriores búsquedas en la base de datos mediante "count"
            models.Comment.findAll({attributes: [models.Sequelize.literal('DISTINCT "Comment"."QuizId"')]}).then(
              function(totalPreguntasConComentarios) {
                mediaComentariosPorPregunta = totalComentarios / totalPreguntas;
                totalPreguntasConComentarios = totalPreguntasConComentarios.length;
                totalPreguntasSinComentarios = totalPreguntas - totalPreguntasConComentarios;
                res.render('statistics/index', {totalPreguntas: totalPreguntas,
                                                totalComentarios: totalComentarios,
                                                mediaComentariosPorPregunta: mediaComentariosPorPregunta,
                                                totalPreguntasSinComentarios: totalPreguntasSinComentarios,
                                                totalPreguntasConComentarios: totalPreguntasConComentarios,
                                                errors: []});
              }
            ).catch(function(error) { next(error)});
          }

        ).catch(function(error) { next(error)});
      }

    ).catch(function(error) { next(error)});
};
