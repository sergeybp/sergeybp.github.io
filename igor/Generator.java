import java.io.*;

public class Generator {

    public static void main(String[] args) throws IOException {
        String filename = args[0];

        File file = new File(filename);

        int id = 111;
        String result = "<table align=\"center\">";

        BufferedReader br = new BufferedReader(new FileReader(file));

        String st;
        while ((st = br.readLine()) != null){
            result+="<tr>";
            for(int i = 0; i< st.length(); i++){
                result+="<td>";
                result+="<button id=\""+ (id) + "\" onmouseover=\"";
                if(st.charAt(i) == '1') {
                    result+="wall(\'"+id+"\')";
                } else {
                    result+="space(\'"+id+"\')";

                }
                id++;
                result+="\">X</button>";
                result+="</td>";
            }
            result+="</tr>";

        }
        result += "</table>";

        BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt", true));
        writer.append(result);
        writer.close();

    }
}


