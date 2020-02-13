using Microsoft.ML;
using Microsoft.ML.Data;
using static Microsoft.ML.DataOperationsCatalog;
using Microsoft.ML.Trainers;
using Microsoft.ML.Transforms.Text;
using System.IO;
using System;

namespace DatingApp.MLModels
{
    public static class SentimentAnalysis
    {
        private static readonly string _dataPath = Path.Combine(Environment.CurrentDirectory, "MLModels", "train_data.csv");

        public static ITransformer TrainModel(MLContext mlContext){
            
            var loader = mlContext.Data.CreateTextLoader(new[] {
                new TextLoader.Column("content", DataKind.String, 1),
                new TextLoader.Column("sentiment", DataKind.String, 0)
            },
            hasHeader: true,
            separatorChar: ',');
            var data = loader.Load(_dataPath);

            var learningPipeline = mlContext.Transforms.Text.FeaturizeText("Features", "content");
            learningPipeline.Append(mlContext.MulticlassClassification.Trainers
                                .LbfgsMaximumEntropy(labelColumnName:"sentiment", featureColumnName:"Features"));

            var model = learningPipeline.Fit(data);

            return model;
        }

        public static string PredictSingleSentiment(MLContext mlContext, ITransformer model, string text){
            PredictionEngine<SentimentData, SentimentPrediction> predictionFunction = 
            mlContext.Model.CreatePredictionEngine<SentimentData, SentimentPrediction>(model);

            var data = new SentimentData {
                content = text
            };

            var result = predictionFunction.Predict(data);

            return result.sentiment.ToString();
        }
    }
}