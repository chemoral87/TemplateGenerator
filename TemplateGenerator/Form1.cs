using System;
using System.Collections.Generic;
using System.IO;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Text;
using System.Windows.Forms;
using MySql.Data.MySqlClient;
using System.Data.SqlClient;
using NVelocityTemplateEngine.Interfaces;
using NVelocityTemplateEngine;
using NVelocity;
using System.Collections;
using System.Net;
using Microsoft.VisualBasic;
using NVelocity.App;
using System.Security.Cryptography;
using System.Globalization;

namespace TemplateGenerator
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        String stringConn;
        DataSet DatosTablas = new DataSet();
        

        private void button1_Click(object sender, EventArgs e)
        {

          connection();

        }

        private void connection()
        {

          dataGridView1.DataSource = null;
          DatosTablas.Tables.Clear();
          if (rBtMSSQL.Checked)
          {
            stringConn = "Server=" + tHost.Text + ";Database=" + tDB.Text + ";Uid=" + tUser.Text + ";Pwd=" + tPassword.Text + ";";
            SqlConnection conn = new SqlConnection(stringConn);
            lsOutTable.Items.Clear();
            lsInTable.Items.Clear();
            try
            {
              conn.Open();
              lStatus.Text = " Conexión con Éxito ";
              conn.Close();
              getTablesMSSQL();
              btnGenerate.Enabled = true;
            }
            catch (Exception ex)
            {
              lStatus.Text = " Error en la conexión :" + ex.Message.ToString();
              btnGenerate.Enabled = false;
            }
          }
          else if (rBtMySQL.Checked)
          {
            stringConn = "Server=" + tHost.Text + ";Database=" + tDB.Text + ";Uid=" + tUser.Text + ";Pwd=" + tPassword.Text + ";";
            MySqlConnection conn = new MySqlConnection(stringConn);
            lsOutTable.Items.Clear();
            lsInTable.Items.Clear();
            try
            {
              conn.Open();
              lStatus.Text = " Conexión con Éxito ";
              conn.Close();
              getTablesMySQL();
              btnGenerate.Enabled = true;
            }
            catch (Exception ex)
            {
              lStatus.Text = " Error en la conexión :" + ex.Message.ToString();
              btnGenerate.Enabled = false;
            }
          }
        }

        private void getTablesMySQL()
        {
            MySqlConnection conn = new MySqlConnection(stringConn);
            conn.Open();
            //String cmdText = "Show Tables";
            string cmdText; 
            string table_type = "";
            string filtro = txtFiltro.Text;

            if (rBtnTable.Checked)
            {
              table_type = "BASE TABLE";
            }
            else
            {
                table_type = "VIEW";
            }

            cmdText = String.Format("SELECT TABLE_NAME, TABLE_TYPE FROM information_schema.tables WHERE TABLE_TYPE LIKE '{0}' AND TABLE_NAME LIKE '%{1}%' and TABLE_SCHEMA != 'information_schema' ", table_type, filtro) ;
            MySqlCommand cmd = new MySqlCommand(cmdText, conn);
            MySqlDataReader dr = cmd.ExecuteReader();
            while (dr.Read())
            {
                lsInTable.Items.Add(dr[0]);
            }
            conn.Close();
        }

        private void getTablesMSSQL()
        {
            
            SqlConnection conn = new SqlConnection(stringConn);
            conn.Open();
            String xtype = rBtnTable.Checked ? "u" : "v";
            String Filtro = "";
            if (txtFiltro.Text != "") {
              Filtro = " AND name like '%" + txtFiltro.Text + "%'";
            }
            String cmdText = "select * from sysobjects where xtype='" + xtype + "' "+ Filtro + " order by 1";
            SqlCommand cmd = new SqlCommand(cmdText, conn);
            SqlDataReader dr = cmd.ExecuteReader();
            while (dr.Read())
            {
                lsInTable.Items.Add(dr[0]);
            }
            conn.Close();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            lsOutTable.Items.AddRange(lsInTable.Items);
            lsInTable.Items.Clear();
        }

        private void button3_Click(object sender, EventArgs e)
        {
            lsInTable.Items.AddRange(lsOutTable.Items);
            lsOutTable.Items.Clear();
        }

        private void bTemplate_Click(object sender, EventArgs e)
        {
            folderBrowserDialog1.SelectedPath = tTemplate.Text;
            folderBrowserDialog1.ShowDialog();

            tTemplate.Text = folderBrowserDialog1.SelectedPath;
            lsInTemplate.Items.Clear();
            lsOutTemplate.Items.Clear();
           // getTemplates();
        }

        private void bOut_Click(object sender, EventArgs e)
        {
            folderBrowserDialog1.SelectedPath = tTemplateOut.Text;
            folderBrowserDialog1.ShowDialog();
            tTemplateOut.Text = folderBrowserDialog1.SelectedPath;
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            Velocity.Init();
            tTemplate.Text = Directory.GetCurrentDirectory() + "\\Templates";
            DirectoryInfo obj = new DirectoryInfo(tTemplate.Text);//you can set your directory path here
            DirectoryInfo[] folders = obj.GetDirectories();
            cmbFolder.DataSource = folders;
       /*   lsInTemplate.Items.Clear();
            lsOutTemplate.Items.Clear();
            getTemplates(); */
        }

        private void button5_Click(object sender, EventArgs e)
        {
            lsOutTemplate.Items.AddRange(lsInTemplate.Items);
            lsInTemplate.Items.Clear();
        }

        private void button4_Click(object sender, EventArgs e)
        {
            lsInTemplate.Items.AddRange(lsOutTemplate.Items);
            lsOutTemplate.Items.Clear();
        }

        private void getTemplates()
        {
            string[] files = Directory.GetFiles(tTemplate.Text + "\\" + cmbFolder.Text);
            // string[] files = Directory.GetFiles(@"e:\Templates");
            foreach (string file in files)
            {
                string fileName = Path.GetFileName(file);
                lsInTemplate.Items.Add(fileName);
            }
        }

        private string titleCamel(String column_name)
        {
            String column_title = "";
            bool isFirstLetterWord = true;
            foreach (char letter in column_name)
            {

                if (letter == '_')
                {
                    column_title += " ";
                    isFirstLetterWord = true;
                }
                else
                {
                    if (isFirstLetterWord)
                    {
                        column_title += letter.ToString().ToUpper();
                        isFirstLetterWord = false;
                    }
                    else
                    {
                        column_title += letter.ToString().ToLower();
                    }
                }

            }

            return column_title;
        }

        private void generateOutput()
        {
            //String path = tTemplate.Text + "\\" + cmbFolder.Text.ToString();
            /* INVelocityEngine fileEngine =
               NVelocityEngineFactory.CreateNVelocityFileEngine(tTemplate.Text, true); */
            foreach (string tableName in lsOutTable.Items) // OBTENER LAS TABLAS
            {
                foreach (string templateName in lsOutTemplate.Items)
                {
                    IDictionary context = new Hashtable();

                    String _tableNameUpper = tableName.ToUpper();
                    String _tableNameLower = tableName.ToLower();
                    String _tableNameTitle = _tableNameLower.Substring(0, 1).ToUpper() + _tableNameLower.Substring(1);
                    String _model = tableName.Remove(tableName.Length - 1, 1);
                    TextInfo info = CultureInfo.CurrentCulture.TextInfo;
                    String _modelPascal = info.ToTitleCase(_model).Replace("_", string.Empty);
                    String _modelKebab = _model.Replace("-", string.Empty);
                    

                    String[] shr = tableName.Split('_');
                    String _tableShortName = "";
                    foreach (String s in shr)
                    {
                        _tableShortName += s.Substring(0, 1).ToUpper();
                    }

                    DataTable dat = new DataTable();
                    dat = DatosTablas.Tables[tableName].Clone();
                    foreach (DataRow row in DatosTablas.Tables[tableName].Rows)
                    {
                        String chk = row["_chk_"].ToString();
                        if ((bool)row["_chk_"] == true)
                        {
                            dat.ImportRow(row);
                        }
                    }

                    VelocityContext velocityContext = new VelocityContext();
                    velocityContext.Put("DataModel", dat);
                    velocityContext.Put("nombretabla", _tableNameLower);
                    velocityContext.Put("Nombretabla", _tableNameTitle);
                    velocityContext.Put("NOMBRETABLA", _tableNameUpper);
                    velocityContext.Put("NOMBRETB", _tableShortName);

                    velocityContext.Put("models", _tableNameLower);
                    velocityContext.Put("Models", _tableNameTitle);
                    velocityContext.Put("MODELS", _tableNameUpper);

                    velocityContext.Put("modelPascal", _modelPascal);
                    velocityContext.Put("modelKebab", _modelKebab);
                    velocityContext.Put("model", _model);

                    /*
                    context.Add("DataModel", dat);
                    context.Add("nombretabla", _tableNameLower);
                    context.Add("Nombretabla", _tableNameTitle);
                    context.Add("NOMBRETABLA", _tableNameUpper);
                    context.Add("NOMBRETB", _tableShortName);
                    */



                    StringBuilder sb = new StringBuilder();
                    using (StreamReader sr = new StreamReader( tTemplate.Text + "\\" + cmbFolder.Text + "\\" + templateName ))
                    {
                        String line;
                        // Read and display lines from the file until the end of 
                        // the file is reached.
                        while ((line = sr.ReadLine()) != null)
                        {
                            sb.AppendLine(line);
                        }
                    }
                    string template = sb.ToString();
                    var final = new StringBuilder();
                    Velocity.Evaluate(
                velocityContext,
                new StringWriter(final),
                "Test",
                new StringReader(template));


                    String _templateNewName = templateName.Replace("TABLENAME", _tableNameUpper);
                     _templateNewName = templateName.Replace("modelPascal", _modelPascal);

                    //String _template = fileEngine.Process(context, templateName);
                    String fullTempPath = tTemplateOut.Text + "\\" + _templateNewName;
                    if (File.Exists(fullTempPath))
                    {
                        File.Delete(fullTempPath);
                    }
                    /* ostrm = LUGAR DONDE SE GUARDARA EL ARCHIVO */
                    if (!Directory.Exists(tTemplateOut.Text))
                    {
                        Directory.CreateDirectory(tTemplateOut.Text);
                    }

                    FileStream ostrm = new FileStream(fullTempPath, FileMode.OpenOrCreate, FileAccess.Write);
                    StreamWriter sw;
                    if (rBtMySQL.Checked)
                    {
                      sw = new StreamWriter(ostrm, Encoding.ASCII);
                    }
                    else {
                      sw = new StreamWriter(ostrm, Encoding.UTF8);
                    }

                    
                    //sw.WriteLine(_template);
                    sw.WriteLine(final);
                    sw.Close();
                }
            }

            //conn.Close();
            MessageBox.Show(" Plantillas Generadas ");
        }

        private void button6_Click(object sender, EventArgs e)
        {
            generateOutput();

        }



        private void lsInTable_DoubleClick(object sender, EventArgs e)
        {
            AgregaTabla();
        }

        private void lsOutTable_DoubleClick(object sender, EventArgs e)
        {
            int index = lsOutTable.SelectedIndex;
            if (index > -1)
            {
                lsInTable.Items.Add(lsOutTable.Items[index]);
                lsOutTable.Items.RemoveAt(index);
            }
        }


        private void lsOutTemplate_DoubleClick(object sender, EventArgs e)
        {
            int index = lsOutTemplate.SelectedIndex;
            if (index > -1)
            {
                lsInTemplate.Items.Add(lsOutTemplate.Items[index]);
                lsOutTemplate.Items.RemoveAt(index);
            }
        }

        private void button7_Click(object sender, EventArgs e)
        {

        }

        private void Form1_PaddingChanged(object sender, EventArgs e)
        {

        }



        private void button8_Click(object sender, EventArgs e)
        {
            AgregaTabla();
        }

        private void AgregaTabla()
        {
            int index = lsInTable.SelectedIndex;
            if (index > -1)
            {
                lsOutTable.Items.Add(lsInTable.Items[index]);
                String itemTable = lsInTable.Items[index].ToString();
                generaCampos(itemTable);
                lsInTable.Items.RemoveAt(index);
            }
        }

        private void generaCampos(String tableName)
        {
            if (rBtMSSQL.Checked)
            {
                generateCamposMSSQL(tableName);
            }
            else if (rBtMySQL.Checked)
            {
                generateCamposMySQL(tableName);
            }
        }

        private void generateCamposMSSQL(String tableName)
        {
            SqlConnection conn = new SqlConnection(stringConn);
            conn.Open();
            string[] serverVersion = conn.ServerVersion.ToString().Split('.');
            string version = serverVersion[0];

            String cmdText = "";

            if (version == "9")
            {
                cmdText = "SELECT 1 _chk_, CASE " +
                     " WHEN a.CONSTRAINT_TYPE = 'PRIMARY KEY' " +
                         " THEN 'PRI' " +
                         " ELSE '' " +
                         " END AS COLUMN_KEY, c.TABLE_NAME, LOWER(c.COLUMN_NAME) COLUMN_NAME, LOWER(c.COLUMN_NAME) COLUMN_TITLE, c.ORDINAL_POSITION, c.IS_NULLABLE, c.DATA_TYPE, c.CHARACTER_MAXIMUM_LENGTH, c.NUMERIC_PRECISION, c.NUMERIC_SCALE" +
                     " FROM information_schema.COLUMNS c " +
                     " LEFT JOIN  INFORMATION_SCHEMA.KEY_COLUMN_USAGE  AS b " +
                     " ON (  C.TABLE_NAME = B.TABLE_NAME " +
                     " AND C.TABLE_CATALOG = B.TABLE_CATALOG " +
                     " AND C.COLUMN_NAME = B.COLUMN_NAME ) " +
                     " LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS a " +
                     " ON ( a.CONSTRAINT_NAME = b.CONSTRAINT_NAME " +
                     " AND A.CONSTRAINT_CATALOG = B.CONSTRAINT_CATALOG " +
                     " AND A.TABLE_NAME = B.TABLE_NAME) " +
                     " WHERE c.TABLE_NAME = '" + tableName + "'";
            }
            else if (version == "10" || version == "11" || version == "12")
            {
                cmdText = "SELECT 1 _chk_, CASE " +
                      " WHEN a.CONSTRAINT_TYPE = 'PRIMARY KEY' " +
                          " THEN 'PRI' " +
                          " ELSE '' " +
                          " END AS COLUMN_KEY, c.TABLE_NAME, LOWER(c.COLUMN_NAME) COLUMN_NAME, LOWER(c.COLUMN_NAME) COLUMN_TITLE, c.ORDINAL_POSITION, c.IS_NULLABLE, c.DATA_TYPE, c.CHARACTER_MAXIMUM_LENGTH, c.NUMERIC_PRECISION, c.NUMERIC_SCALE " +
                      " FROM information_schema.COLUMNS c " +
                      " LEFT JOIN  INFORMATION_SCHEMA.KEY_COLUMN_USAGE  AS b " +
                      " ON (  C.TABLE_NAME = B.TABLE_NAME " +
                      " AND C.TABLE_CATALOG = B.TABLE_CATALOG " +
                      " AND C.COLUMN_NAME = B.COLUMN_NAME ) " +
                      " LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS a " +
                      " ON ( a.CONSTRAINT_NAME = b.CONSTRAINT_NAME " +
                      " AND A.CONSTRAINT_CATALOG = B.CONSTRAINT_CATALOG " +
                      " AND A.TABLE_NAME = B.TABLE_NAME) " +
                      " WHERE c.TABLE_NAME = '" + tableName + "'";
            }

            SqlCommand cmd = new SqlCommand(cmdText, conn);
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            da.Fill(ds);

            DataTable dt = new DataTable();
            dt = ds.Tables[0].Clone();  //ds.Tables[0].Copy();
            //DataGridViewComboBoxColumn colNullable = new DataGridViewComboBoxColumn();

            dt.Columns[0].DataType = typeof(bool);

            foreach (DataRow row in ds.Tables[0].Rows)
            {
                row["COLUMN_TITLE"] = titleCamel(row["COLUMN_TITLE"].ToString());
                dt.ImportRow(row);
            }

            dt.TableName = tableName;
            bool existe = DatosTablas.Tables.Contains(tableName);
            if (!existe)
            {
                DatosTablas.Tables.Add(dt);
            }
            conn.Close();
        }

        private void generateCamposMySQL(String tableName)
        {
            MySqlConnection conn = new MySqlConnection(stringConn);
            conn.Open();

            String cmdText = "SELECT  1 _chk_, COLUMN_KEY, TABLE_NAME, LOWER(COLUMN_NAME) COLUMN_NAME, LOWER(COLUMN_NAME) COLUMN_TITLE, ORDINAL_POSITION, IS_NULLABLE, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, NUMERIC_PRECISION, NUMERIC_SCALE  FROM information_schema.COLUMNS " +
                  "WHERE TABLE_NAME = \"" + tableName + "\" AND TABLE_SCHEMA = \"" + tDB.Text + "\"";
            MySqlCommand cmd = new MySqlCommand(cmdText, conn);
            DataSet ds = new DataSet();
            MySqlDataAdapter da = new MySqlDataAdapter(cmd);
            da.Fill(ds);

            DataTable dt = new DataTable();
            dt = ds.Tables[0].Clone();

            dt.Columns[0].DataType = typeof(bool);
            foreach (DataRow row in ds.Tables[0].Rows)
            {
                row["COLUMN_TITLE"] = titleCamel(row["COLUMN_TITLE"].ToString());
                dt.ImportRow(row);
            }

            dt.TableName = tableName;
            bool existe = DatosTablas.Tables.Contains(tableName);
            if (!existe)
            {
                DatosTablas.Tables.Add(dt);
            }
            conn.Close();
        }

        private void button10_Click(object sender, EventArgs e)
        {
            int index = lsOutTable.SelectedIndex;
            if (index > -1)
            {
                lsInTable.Items.Add(lsOutTable.Items[index]);
                lsOutTable.Items.RemoveAt(index);
            }
        }

       



        private void lsInTemplate_DoubleClick(object sender, EventArgs e)
        {
            int index = lsInTemplate.SelectedIndex;
            if (index > -1)
            {
                lsOutTemplate.Items.Add(lsInTemplate.Items[index]);
                lsInTemplate.Items.RemoveAt(index);
            }
        }

      

        private void lsOutTable_SelectedIndexChanged(object sender, EventArgs e)
        {
            //lStatus.Text = "cus";
            ListBox bx = (ListBox)sender;

            if (bx.SelectedItem == null)
            {
                dataGridView1.DataSource = null;
            }
            else
            {
                String table = bx.SelectedItem.ToString();

                dataGridView1.DataSource = DatosTablas.Tables[table];
            }

        }

        private void button5_Click_1(object sender, EventArgs e)
        {
            Double IVA = (Double.Parse(txtIVA.Text) / 100) + 1;
            txtErogacion.Text = Financial.Pmt(
              ((Double.Parse(txtTasaOperativa.Text) / 100) / 12) * IVA, /* Rate */
              Double.Parse(txtNumeroPagos.Text),  /* Nper */
              Double.Parse(txtCapital.Text) * -1 /* PV */
              ).ToString();
        }

        private void button2_Click_1(object sender, EventArgs e)
        {
            Double IVA = (Double.Parse(txtIVA.Text) / 100) + 1;

            Double rate = Financial.Rate(
              Double.Parse(txtNumeroPagos.Text),
              Double.Parse(txtErogacion.Text),
              Double.Parse(txtCapital.Text) * -1
              );

            rate = rate * 100 * 12 / IVA;
            txtTasaOperativa.Text = rate.ToString();
        }

        private void cmbFolder_SelectedValueChanged(object sender, EventArgs e)
        {
            lsInTemplate.Items.Clear();
            lsOutTemplate.Items.Clear();
            getTemplates();
        }

        private void button1_Click_1(object sender, EventArgs e)
        {
          //DateTime dt = new DateTime();
          DateTime now = DateTime.Now;
          while (dtgValores.RowCount < 3)
          {
            //GetToken(now.ToShortDateString());
            //GetToken((now.Day+now.Month+now.Year+now.DayOfYear).ToString());

            GetToken(now.DayOfYear.ToString("D3") + now.Year.ToString("D4") + now.Month.ToString("D2") + now.Day.ToString("D2"));
            now = now.AddDays(1);
          }
          
        }

        private void GetToken(String date) {
          byte[] buffer = System.Text.Encoding.ASCII.GetBytes(date);
          ulong result = BitConverter.ToUInt64(buffer, 0); // unsigned to avoid having to use Abs
          var token = result.ToString("D10"); // pads the result to 10 digits
          token = token.Substring(token.Length - 10); // strip out extra digits, if any
          string numero1 = "01";
          string numero2 = "02";
          string numero3 = "06";
          string numero4 = "19";
          string[] tok_arr = new string[5];
          tok_arr[0] = token.Substring(0, 2);
          tok_arr[1] = token.Substring(2, 2);
          tok_arr[2] = token.Substring(4, 2);
          tok_arr[3] = token.Substring(6, 2);
          tok_arr[4] = token.Substring(8, 2);

          if (isIn(numero1,tok_arr))
          {
            if (isIn(numero2, tok_arr))
            {
              if (isIn(numero3, tok_arr))
              {
                if (isIn(numero4, tok_arr))
                {
                  dtgValores.Rows.Add(date, token);
                }
              }
            }
          }
          //textBox3.Text = token;
        }

        private bool isIn(String value, String[] array)
        {
          foreach (string val_arr in array) {
            if( val_arr == value)
            return true;
          }
          return false;
        }
               

        private void txtFiltro_KeyUp(object sender, KeyEventArgs e)
        {
          connection();
        }

        private void txtFiltro_TextChanged(object sender, EventArgs e)
        {
            getTablesMySQL();
        }

        private void button6_Click_1(object sender, EventArgs e)
        {
            string folder = tTemplateOut.Text;
            System.Diagnostics.Process.Start("explorer.exe", folder);
        }

        private void button16_Click(object sender, EventArgs e)
        {
            string folder = tTemplate.Text;
            System.Diagnostics.Process.Start("explorer.exe", folder);
        }

        private void addAll_Click(object sender, EventArgs e)
        {
            foreach( var item in lsInTemplate.Items)
            {
                lsOutTemplate.Items.Add(item);
            }
            lsInTemplate.Items.Clear();
        }
        private void button9_Click(object sender, EventArgs e)
        {
            int index = lsInTemplate.SelectedIndex;
            if (index > -1)
            {
                lsOutTemplate.Items.Add(lsInTemplate.Items[index]);
                lsInTemplate.Items.RemoveAt(index);
            }
        }

        private void button11_Click(object sender, EventArgs e)
        {
            int index = lsOutTemplate.SelectedIndex;
            if (index > -1)
            {
                lsInTemplate.Items.Add(lsOutTemplate.Items[index]);
                lsOutTemplate.Items.RemoveAt(index);
            }
        }

        private void removeAll_Click(object sender, EventArgs e)
        {
            foreach (var item in lsOutTemplate.Items)
            {
                lsInTemplate.Items.Add(item);
            }
            lsOutTemplate.Items.Clear();
        }
    }
}