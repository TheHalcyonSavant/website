'use strict';

angular.module('DataMock', [])
  .factory('Data', function (promise){

    return {

      checkIsAdministrator: function (){
        return promise(1);
      },

      getGitHubHTML: function (path){
        var result;

        switch (path)
        {
          case 'VocabularyGame/readme':
            result = '<div class="announce instapaper_body md" data-path="README.md" id="readme"><article class="markdown-body entry-content" itemprop="mainContentOfPage"><h2><a name="user-content-vocabularygame---better-your-elocution" class="anchor" href="#vocabularygame---better-your-elocution"><span class="octicon octicon-link"></span></a>VocabularyGame - Better your elocution</h2><p><em><a href="http://www.sciencedaily.com/releases/2012/10/121005123902.htm">Testing is the best learning tool</a></em></p><p>        This is a very simple test game that accumulates points based on your correctly guessed choices. The question is on the top of the window and you must choose only one from five random choices to proceed to the next question.<br>Testing is the best approach to gain any knowledge and with this game it can\'t be easier.</p><h3><a name="user-content-installation" class="anchor" href="#installation"><span class="octicon octicon-link"></span></a>Installation</h3><ol class="task-list"><li>Download <a href="dictionary.xlsm?raw=true">dictionary.xlsm</a> to some permanent location on your disk (like My Documents)</li><li>Download <a href="/VocabularyGame.msi?raw=true">VocabularyGame.msi</a>, install and run VocabularyGame from your desktop</li><li>When the open file dialog pops up, locate dictionary.xlsm</li><li>Enjoy, the game is started !</li></ol><h2><a name="user-content-game-rules" class="anchor" href="#game-rules"><span class="octicon octicon-link"></span></a>Game Rules</h2><p>        The game is simply played by choosing only one option from the five <em>Radio Buttons</em>. The choice you made should correspond to the question (the light-green text on the top of the window). If you choose correctly, you gain <strong>+5 points</strong>. But, if you are wrong, you <strong>loose all your points</strong> that you have accumulated so far. In meanwhile, if the <em>Countdown timer</em> is on and its time passes, then you loose <strong>-15 points</strong> instead of all of them.</p><p>When you click the sound icon (next to the question) you can hear and learn how to pronounce the phrase. These sounds are downloaded into the <em>sounds/</em> folder.</p><p>When you gain <strong>30 points</strong> for the first time, then you\'ve made the first record. To break it again you must pass the best record made so far. To see all records go to <em>File -&gt; Records</em>. The records are stored inside <em>dat/{dictionaryWithNoExt}_records.dat</em> file (e.g. <em>dat/dictionary_records.dat</em>) and saved upon leaving the application.</p><p>Right clicking the synonyms (the <strong>bold</strong> radio buttons) will bring up a <em>tooltip</em> with the corresponding Macedonian translation, if there is one. Every next right clicking on the same choice will cycle through the translations. Be careful right clicking the synonyms, after guessing the right answer you will loose <strong>-5 points</strong> instead of gaining.</p><h2><a name="user-content-dictionaryxlsm" class="anchor" href="#dictionaryxlsm"><span class="octicon octicon-link"></span></a>dictionary.xlsm</h2><p>        When you open the application for the first, an open dialog pops out and asks you to locate <em>dictionary.xlsm</em>. This is a Macro-Enabled Excel file that contains all the unique entries, important for this game to choose from. You must have installed <strong>Microsoft Office 2007</strong> or newer version to edit this file.<br>This excel file contains 4 columns:<br>         <strong>A</strong> : <strong>English</strong> - this is the key column. The question is randomly generated from this column. Contains single word (e.g. <em>affix</em>), phrases (e.g. <em>bundle up</em>), also words with additional explanation in parenthesis like <em>maiden (adjective)</em>;<br>         <strong>B</strong> : <em>Lexicon</em> - a meaningful explanations in English;<br>         <strong>C</strong> : <strong>Synonyms</strong> - words with same or similar meanings;<br>         <strong>D</strong> : Macedonian - direct Cyrillic translation.<br>         Columns <strong>B</strong>, <strong>C</strong> and <strong>D</strong> can have more then one meaning separated by semicolon and new line (e.g. see <em>calf</em>). Also, those columns can be empty if a translation or explanation is not necessary. The 5 random answers are generated from these 3 columns. </p><h2><a name="user-content-user-settings" class="anchor" href="#user-settings"><span class="octicon octicon-link"></span></a>User Settings</h2><h4><a name="user-content-answer-types" class="anchor" href="#answer-types"><span class="octicon octicon-link"></span></a>Answer Types</h4><p>corresponds to \'dictionary.xlsm\' columns: <em>Lexicon</em>, <strong>Synonyms</strong> and Macedonian. The 5 random choices are generated through limitation on these checked MenuItems (answer types). For example, if you check Lexicon and Synonyms, but uncheck Macedonian, then you will NOT see Macedonian (Cyrillic) words in the 5 random choices from the next question.</p><blockquote><p>If some random choice is Lexicon, then it\'s displayed in <em>Italic</em>. And if it\'s Synonym it is displayed in <strong>Bold</strong>.</p></blockquote><h4><a name="user-content-auto-pronounce-question" class="anchor" href="#auto-pronounce-question"><span class="octicon octicon-link"></span></a>Auto-Pronounce question</h4><p>Automatically pronounce the question on every new round.</p><h4><a name="user-content-countdown-timer" class="anchor" href="#countdown-timer"><span class="octicon octicon-link"></span></a>Countdown Timer</h4><p>When you check this setting, a "Timer" box is showed at the right of the answers and below the points. The time is set at 20 seconds and when the time is up you loose 15 points. The countdown starts from the next question.</p><h4><a name="user-content-dont-show-me-choices-i-guessed-more-then" class="anchor" href="#dont-show-me-choices-i-guessed-more-then"><span class="octicon octicon-link"></span></a>Don\'t show me choices I guessed more then</h4><p>This setting limits the repetition of displayed question-answer pairs. For example if you choose "Don\'t show me choices I guessed more then = 3 times" and if you have guessed question "virtue" with answer "merit" twice already, then this question with this particular answer will not be displayed again.<br>The repetitions history of these pairs are saved inside <em>dat/{dictionaryWithNoExt}_repeats.dat</em> file (e.g. <em>dat/dictionary_repeats.dat</em>).<br>This setting can be very handy if you want to filter very known words, but you want to avoid removing them from the excel file.</p><h3><a name="user-content-language" class="anchor" href="#language"><span class="octicon octicon-link"></span></a>Language</h3><p>User Interface localization language. Needs restart for this setting to take effect.</p><h3><a name="user-content-repeat-the-last-5-wrong-choices" class="anchor" href="#repeat-the-last-5-wrong-choices"><span class="octicon octicon-link"></span></a>Repeat the last 5 wrong choices</h3><p>Every time a wrong answer is chosen, the program accumulates them in <em>dat/{dictionaryWithNoExt}_wrongs.dat</em> (e.g. <em>dat/dictionary_records.dat</em>). After the fifth wrong choice VocabularyGame starts re-asking you with the same wrongfully answered questions, if this setting is checked.</p><h4><a name="user-content-reset-all-settings" class="anchor" href="#reset-all-settings"><span class="octicon octicon-link"></span></a>Reset All Settings</h4><p>Reset all settings in the main menu "Settings" to its default values. The default values can be edited inside <em>VocabularyGame.exe.config</em> file under <em>configuration &gt; userSettings</em> xml node.</p><h2><a name="user-content-application-settings" class="anchor" href="#application-settings"><span class="octicon octicon-link"></span></a>Application Settings</h2><p>The application settings can be edited inside <em>VocabularyGame.exe.config</em> file in the program\'s installation directory under <em>configuration &gt; applicationSettings</em> xml node:</p><ul class="task-list"><li><strong>CountdownSeconds</strong> (Default: 20)</li><li><strong>GStaticLink</strong> (google link needed for downloading word pronunciations)</li><li><strong>RecordsSuffix</strong> (Default: _records.dat)</li><li><strong>RepeatsSuffix</strong> (Default: _repeats.dat)</li><li><strong>WrongsLimit</strong> (The amount of wrong choices limit - see <em>Repeat the last 5 wrong choices</em> user setting. Default: 5)</li><li><strong>WrongsSuffix</strong> (Default: _wrongs.dat)</li></ul><h2><a name="user-content-thanx-to" class="anchor" href="#thanx-to"><span class="octicon octicon-link"></span></a>Thanx to</h2><p><a href="http://stackoverflow.com/a/1134340">Pavel Chuchuva</a> for GifImage.cs<br><a href="http://en.wikipedia.org/wiki/Google_Dictionary">Google Dictionary</a> for making this game "sounds" better</p><h6><a name="user-content-other-repositories" class="anchor" href="#other-repositories"><span class="octicon octicon-link"></span></a>Other repositories:</h6><p>        Use <a href="../../../ExcelApp">ExcelApp</a> library if you want to compile this code successfully</p></article></div>';
            break;
        }

        return promise($($.parseHTML(result)));
      },

      repopulateIsCalled: false,

      repopulate: function (){
        var that = this;

        return {
          then: function (){
            that.repopulateIsCalled = true;
          }
        };
      }

    };
  });