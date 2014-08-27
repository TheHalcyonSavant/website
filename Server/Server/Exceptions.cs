using System;
using System.IO;

namespace Server
{
    public class BadYamlException : Exception
    {
        public string YamlText = "";

        public BadYamlException(string message, StreamReader badReader)
            : base(message)
        {
            if (badReader.BaseStream.CanSeek)
            {
                badReader.BaseStream.Position = 0;
                badReader.DiscardBufferedData();
                YamlText = badReader.ReadToEnd();
            }
            Data["YamlText"] = YamlText;
        }
    }
}