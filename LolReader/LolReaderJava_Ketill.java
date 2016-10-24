import java.io.*;
import java.lang.*;
import java.util.*;
public class A {
	
	//fylki með öllum chmapions
	public static String[] champList = {"Aatrox" , "Ahri" , "Akali" , "Alistar" , "Amumu" , "Anivia" , "Annie" , "Ashe" , "Azir" , "Bard" , "Blitzcrank" , "Brand" , "Braum" , "Caitlyn" , "Cassiopeia" , "Chogath" , "Corki" , "Darius" , "Diana" , "DrMundo" , "Draven" , "Ekko" , "Elise" , "Evelynn" , "Ezreal" , "FiddleSticks" , "Fiora" , "Fizz" , "Galio" , "Gangplank" , "Garen" , "Gnar" , "Gragas" , "Graves" , "Hecarim" , "Heimerdinger" , "Illaoi" , "Irelia" , "Janna" , "JarvanIV" , "Jax" , "Jayce" ,"Jhin" , "Jinx" , "Kalista" , "Karma" , "Karthus" , "Kassadin" , "Katarina" , "Kayle" , "Kennen" , "Khazix" , "Kindred" , "KogMaw" , "Leblanc" , "LeeSin" , "Leona" , "Lissandra" , "Lucian" , "Lulu" , "Lux" , "Malphite" , "Malzahar" , "Maokai" , "MasterYi" , "MissFortune" , "Mordekaiser" , "Morgana" , "Nami" , "Nasus" , "Nautilus" , "Nidalee" , "Nocturne" , "Nunu" , "Olaf" , "Orianna" , "Pantheon" , "Poppy" , "Quinn" , "Rammus" , "RekSai" , "Renekton" , "Rengar" , "Riven" , "Rumble" , "Ryze" , "Sejuani" , "Shaco" , "Shen" , "Shyvana" , "Singed" , "Sion" , "Sivir" , "Skarner" , "Sona" , "Soraka" , "Swain" , "Syndra" , "TahmKench" , "Talon" , "Taric" , "Teemo" , "Thresh" , "Tristana" , "Trundle" , "Tryndamere" , "TwistedFate" , "Twitch" , "Udyr" , "Urgot" , "Varus" , "Vayne" , "Veigar" , "Velkoz" , "Vi" , "Viktor" , "Vladimir" , "Volibear" , "Warwick" , "MonkeyKing" , "Xerath" , "XinZhao" , "Yasuo" , "Yorick" , "Zac" , "Zed" , "Ziggs" , "Zilean" , "Zyra"};
	//fylki til þess að telja plays á champion
	public static int[] champPlays = new int[129];
	//champ winrate array
	public static int[][] champWin = new int[2][130];
	//hvaða champ currently er verið að spila í current fileæc 
	public static int currChamp = 130;
	//Býr til scanners
	public static Scanner x;
	//summonernames sem leita á að
	public static String[] names;
	//fjöldi summonernamea
	public static int namecount;
	//blue and red side counter.
	public static int[] team = new int[2];
	//win/loss í leiknum fyri hverja hlid
	public static int outcome[][] =  new int[2][2];
	//temp file um lid
	public static String teamString = "";
	//telur hversu morg iteration hafa keyrst
	public static int runCount = 0;
	//total games
	public static int totalGames = 0;
	//3.10 and upp
	public static String is310;
	//hvaða season er
	public static String season = "";
	//HashMap fyrir summoners
	public static HashMap<String, Integer> people = new HashMap<String, Integer>();
	//top 15 fólk sem hefur spilað með
	public static String[] topS = new String[20];
	public static int[] topI = new int[20];
	
	
	//finnur hvaða version var í gangi
	public static String version()
	{
		int i = 0;
		while(!(x.next().equals("Version")))
		{
			
		}
		String versionString = x.next();
		
		if((versionString.length() < 4)||versionString.substring(0,1).equals("S"))
		{
			versionString = version();
		}
		
		
		is310 = versionString.substring(2,4);
		//System.out.println(auka);
		season = versionString.substring(0,1);
		return versionString;
		
	}
	/*
	
						NEW VERSION PART
	*/
	//CHAMPION
	public static void newVersionC()
	{
		
		//champion info
		while(x.hasNext())
		{
			String a = x.next();
				
			if(a.equals("Spawning"))
			{
				String b = x.next();
				
				if(b.equals("champion"))
				{
					boolean scrap = loggerNew();
					runCount++;
					
					
				}
			
			}
			if(runCount == 10)
			{
				return;
			}
		}
		return;
	}
	//WIN
	public static int Wonnered()
	{
		
		while(x.hasNext())
		{
			String b = x.next();
						
			if(b.equals("exited\",\"exit_code\":\"EXITCODE_WIN\"}"))
			{
				
				
				return 1;
			}
			else if(b.equals("exited\",\"exit_code\":\"EXITCODE_LOSE\"}"))
			{
				
				return 0;
			}
			
			
		}
		return 2;
	}
	
	/*
	
						OLD VERSION PART
	*/
	//CHAMPION
	public static void oldVersionC()
	{
		//fall fyrir gamla versionið
		String a = x.next();
			while(x.hasNext())
			{
				String b = x.next();
				if(b.equals("Hero")&&!a.equals("Creating"))
				{
					boolean done = loggerOld();
					if(done)
					{
						return;
					}	
				}
				a = b;
				//ef summonername er fundið þá enda loopu
			}
		
	}
	
	//les in fileinn og leitar eftir oorðinu spawning champion
	public static void readFile(String path)
	{
		runCount = 0;
		//les in text fileinn
		try
		{
			
			x = new Scanner(new File(path),"UTF-8");
		}
		catch(Exception e)
		{
			System.out.println("Error");
		}
		//x er fileinn
		
		//finnur hvaða version var í gangi
		int versionInt = Integer.parseInt(version().substring(0,1));
		boolean newVersion = versionInt >= 3;
		
		// newVersion = true ef nýja versionið
		//
		
		//Ef fileinn er replay þá hætta.
		for(int d = 0; d < 200; d++)
		{
			String rT = x.next();
			if(rT.contains("replay")|| rT.contains("Replay"))
			{ 
				return;
			}
		}
		//
		
		//Ef nýja version þá
		if(newVersion)
		{
			newVersionC();
			
			
			if(!teamString.equals(""))
			{
				int temp3 = Integer.parseInt(season);
				
				
				String temp2 = is310.substring(1,2);
				
				if(temp3 > 3)	
				{
					
					team();
				}
				else if(!temp2.equals("."))
				{
					team();
				}
			
			}
		}
		//ef gamla version þá...
		else
		{
			oldVersionC();
			
		}
		
		
		
		return;
		
		
		
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//vinnur gögn úr gamla systeminu
	public static boolean loggerOld()
	{
		
		String[] info = new String[8];
		int k = 0;
		while(x.hasNext()&& (k < 7))
		{
			
			
			info[k] = x.next();
			
			
			k++;
		}
		//champion beign played
		String champion = info[0];
		champion = champion.substring(0, champion.length()-3);
		//
		//summoner
		int v = 3;
		boolean sumName = true;
		while(sumName && (v < 6))
		{
			v++;
			if(info[v].endsWith("|"))
			{
				sumName = false;
			}
		}
		String Summoner = "";
		for(int i = 3; i < v; i++)
		{
			Summoner += info[i];
		}
		//
		//athugar hvort summonername er nafnið sem leitað er aðrrr
		boolean isSummoner = true;
		//int summonerIt = Integer.parseInt(names[0]);
		
		for(int r = 0; r < namecount; r++)
		{
			if(Summoner.equals(names[r]))
			{
				isSummoner = false;
			}
		}
		
		if(isSummoner)
		{
			HashPlayer(Summoner);
			return false;
		}
		//
		totalGames++;
		//loggar info
		isPlayer(champion);
		return true;
	}
	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//tekur streng og tekur vinnur með gögn úr honum
	public static boolean loggerNew()
	{
		
		//info með champ og summoner
		String[] info = new String[21];
		for(int i = 0; i < 21; i++)
		{
			
			info[i] = x.next();
			
			
		}
		
		//finnur championin
		int lengd = info[0].length();
		String champion = info[0].substring(1,lengd-1);
		//
		
		
		
		//finnur summonerinn
		int summoner = 12;
		while(!info[summoner].contains(")"))
		{
			summoner++;
		}
		String summonername = "";
		for(int i = 12; i <= summoner; i++)
		{
			summonername += info[i];
		}
		summonername = summonername.substring(1,summonername.length()-1);
		//
		//athugar hvort summonername er nafnið sem leitað er að
		boolean isSummoner = true;
		
		for(int r = 0; r < namecount; r++)
		{
			if(summonername.equals(names[r]))
			{
				isSummoner = false;
			}
		}
		
		if(isSummoner)
		{
			HashPlayer(summonername);
			return false;
		}
		//
		//loggar info
		//blur/red side
		totalGames++;
		
		
		teamString = info[6];
		
		//skrair hvada champion
		isPlayer(champion);
		
		return true;
		
	}
	//notað til að logga summoners í leik
	public static void HashPlayer(String SumName)
	{
		if(people.containsKey(SumName))
		{
			int tempValue = people.get(SumName);
			tempValue++;
			people.put(SumName, tempValue);
			return;
		}
		people.put(SumName, 1);
		return;
		
		
	}
	
	//champion info
	public static void isPlayer(String Champion)
	{
		
		int k = 0;
		while(true)
		{
			
			if(Champion.equals(champList[k]))
			{
				currChamp = k;
				champPlays[k]++;
				
				return;
				
			}
			k++;
		}
	}
	//Finnur hvaða lið vann og hvaða champion
	public static void team()
	{
		int lid = Integer.parseInt(teamString);
		int truu = Wonnered();
		boolean tru;
		//int to boolean
		if(truu == 2)
		{
			return;
		}
		else if(truu == 1)
		{
			
			tru = true;
			champWin[0][currChamp]++;
		}
		else
		{
			tru = false;
			champWin[1][currChamp]++;
		}
		//blue
		if(lid == 100)
		{
			team[0]++;
			
			if(tru)
			{
				outcome[0][0]++;
			}
			else
			{
				outcome[1][0]++;
			}
		}
		//red
		else if(lid == 200)
		{
			team[1]++;
			if(tru)
			{
				outcome[0][1]++;
			}
			else
			{
				outcome[1][1]++;
			}
		}
		return;
	}
	
	//skilar út w/l ratioi fyrir champs
	public static String printWL(int ch)
	{
		double wins = champWin[0][ch];
		double loss = champWin[1][ch];
		
		return percent(wins, loss);
		
	}
	
	//fall sem finnur prósentu A af heild A+B
	public static String percent(double A, double B)
	{
		//System.out.println(A + " " + B);
		if(B <= 0.0)
		{
			if(A <= 0.0)
			{
				return "NaN";
			}
			return "100.0%";
		}
		double WLratio = A/(A+B);
		WLratio = Math.round(WLratio*1000)/10;
		return String.valueOf(WLratio) + "%";
	}
	
	//finnur top 15 ´folk sem hefur spilað með
	public static void topPeople()
	{
		//topS topI
		
		for(String key: people.keySet())
		{
			int c = 0;
			boolean bigger = false;
			int value = people.get(key);
			if(value > topI[0])
			{
				bigger = true;
			}
			while(bigger)
			{
				if(c == 19)
				{
					reArrange(c);
					topS[c] = key;
					topI[c] = value;
					bigger = false;
				}
				else if(value > topI[c+1])
				{
					
				}
				else
				{
					reArrange(c);
					topS[c] = key;
					topI[c] = value;
					bigger = false;
				}
				c++;
			}
		}
		return;
	}
	//endurraðar fylkjunum topS og topI fyrir fallið topPeople
	public static void reArrange(int c)
	{
		for(int i = 0; i < c; i++)
		{
			topS[i] = topS[i+1];
			topI[i] = topI[i+1];
		}
	}
	
	public static void main(String[] args)
	{
		for(int e = 0; e < 129; e++)
		{
			champWin[0][e] = 0;
			champWin[1][e] = 0;
		}
		/*
		Blue red side virkar ekki fyrir old data files!!!!!!!!!!!!!!!!!!!!!
		*/
		//tekur in userinput um summonername
		Scanner in = new Scanner(System.in);
		//fjöldi nafna
		System.out.println("How many names?");
		String temp = in.nextLine();
		namecount = Integer.parseInt(temp);
		System.out.println("You entered: "+ namecount);

		names = new String[namecount];
		
		for(int y = 0; y < namecount; y++)
		{
			System.out.println("Enter an Name");
			names[y] = in.nextLine();
			System.out.println("You entered name: "+ names[y]);
		}
		
		//Býr til klasa með öllum fileum í directorinu
		File test = new File("G:\\Annad\\Logs");
		
		//býr til string[] sem inniheldur öll file nöfnin
		String[] fileNames = test.list();

		//býr til file[] sem inniheldur öll file nöfnin
		File[] F = test.listFiles();

		int t = 0;
		int runs = 0;
		for (File file : F) 
		//for(int q = 0; q < 10; q++)	
		{
			//vizualiser um að forritið er að keyra
			if(runs%1000 == 0)
			{
				System.out.println(runs + " files processed.");
			}
			runs++;
			readFile("G:\\Annad\\Logs\\" + F[t].getName());t++;
			//readFile("G:\\Test\\" + F[t].getName());t++;	
		}
		
		//infoprinter
		System.out.println();
		System.out.println("Champion"+"\t"+"Plays"+"\t"+"\t"+"W/L ratio");
		System.out.println();
		//prentar út champlist
		for(int i = 0; i < 129; i++)
		{
			if(champList[i].length() > 6)
			{
				System.out.println(champList[i] + " \t" + champPlays[i] + " \t" + " \t" + printWL(i));
			}
			else
			{
				System.out.println(champList[i] + " \t \t" + champPlays[i] + " \t" + " \t" + printWL(i));
			}
		}
		System.out.println();
		String blu = percent(outcome[0][0],outcome[1][0]);
		
		String red = percent(outcome[0][1],outcome[1][1]);
		
		System.out.println("Blue side. Wins: " + outcome[0][0] + " Loses: " + outcome[1][0] + " W/L: " + blu);
		System.out.println("Red side. Wins: " + outcome[0][1] + " Loses: " + outcome[1][1] + " W/L: " + red);
		
		System.out.println();
		System.out.println("Total games: " + totalGames);
		System.out.println();
		System.out.println("Top 20 people you have played with");
		topPeople();
		for(int i = 0; i < 20; i++)
		{
			System.out.println(topS[i] + ":" + topI[i]);
		}		
	}
}