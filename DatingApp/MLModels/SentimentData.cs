using Microsoft.ML.Data;

namespace DatingApp.MLModels
{
    public class SentimentData
    {
        [LoadColumn(0)]
        public string content;

        [LoadColumn(1), ColumnName("Label")]
        public string sentiment;
    }
}