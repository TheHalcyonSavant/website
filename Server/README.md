The Halcyon Savant official website - server codes
-----------------------------------------------------
###Pre-installation
1. SQL Server 2012
2. Visual Studio 2013
3. [xUnit runner extension](http://visualstudiogallery.msdn.microsoft.com/463c5987-f82b-46c8-a97e-b1cde42b9099)

###Installation
1. Change `Data Source=` in all `<connectionStrings>` in [app.confing](Server.Tests/app.config) and [Web.config](Server/Web.config) to point to your SQL Server host
2. In your hosts file (\Windows\System32\Drivers\etc\hosts) uncomment these lines:
```
127.0.0.1 localhost
::1 localhost
```
3. Change [GH_USERNAME](Server/DAL/GitHub.cs#L25) to your GitHub account name
4. Make sure all your personal repositories have valid `languages.yml` in their roots. For example, check this [yml](../languages.yml)

###Run
Before running Server project make sure all tests in Server.Tests pass successfully.  
../Deploy is the publishing directory, don't forget to add the right IIS permissions if you want to use it from outside.
