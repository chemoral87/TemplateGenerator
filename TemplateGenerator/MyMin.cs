using System;
using System.Collections.Generic;
using System.Text;

namespace TemplateGenerator
{
    class MyMin
    {

        #region public constants
        public const System.Char LF = '\n', SPACE = ' ', EOS = System.Char.MinValue;
        #endregion

        #region protected variables
        protected System.Boolean cc_on;
        protected System.Char a, ahead, b;
        protected System.Int32 index = 0, length;
        protected System.String input;
        protected System.Text.StringBuilder output = new System.Text.StringBuilder();
        #endregion

        #region static public methods
        static public System.String parse(System.String input)
        {
            return MyMin.parse(input, true);
        }
        static public System.String parse(System.String input, System.Boolean cc_on)
        {
            return new MyMin(input, cc_on).ToString();
        }
        static public System.String parse(System.String input, System.Boolean cc_on, System.Boolean css)
        {
            return css ? new MyMinCSS(input, cc_on).ToString() : new MyMin(input, cc_on).ToString();
        }
        #endregion

        #region constructor
        public MyMin(System.String input)
        {
            this.init(input, true);
        }

        public MyMin(System.String input, System.Boolean cc_on)
        {
            this.init(input, cc_on);
        }
        #endregion

        #region public override methods
        public override System.String ToString()
        {
            return this.output.ToString().TrimStart().Replace("\n\n", "\n");
        }

        public static implicit operator System.String(MyMin o)
        {
            return o.ToString();
        }
        #endregion

        #region virtual protected methods
        virtual protected void action(System.Int32 i)
        {
            if (i < 2)
                this.output.Append(this.a);
            if (i < 3)
            {
                this.a = this.b;
                if (this.a == '\'' || this.a == '"')
                {
                    while (true)
                    {
                        this.output.Append(this.a);
                        if (!this.nextCharNoSlash(this.b, "Unterminated string literal."))
                            break;
                    }
                }
            }
            if (i < 4)
            {
                this.b = this.next();
                if (this.b == '/')
                {
                    switch (this.a)
                    {
                        case MyMin.LF:
                        case MyMin.SPACE:
                        case '{':
                        case ';':

                        case '(':
                        case ',':
                        case '=':
                        case ':':
                        case '[':
                        case '!':
                        case '&':
                        case '|':
                        case '?':
                            if ((MyMin.LF == this.a || MyMin.SPACE == this.a) && !this.spaceBeforeRegExp(this.output.ToString()))
                                break;
                            this.output.Append(this.a);
                            this.output.Append(this.b);
                            while (this.nextCharNoSlash('/', "Unterminated regular expression literal."))
                                this.output.Append(this.a);
                            this.b = this.next();
                            break;
                    }
                }
            }
        }

        virtual protected void appendComment(System.Int32 pos, System.String open, System.String close)
        {
            this.output.Append(this.a);
            this.output.Append(open);
            this.output.Append(new MyMin(this.input.Substring(this.index, pos - this.index), this.cc_on));
            this.output.Append(close);
            this.index = pos;
            this.a = MyMin.LF;
        }

        virtual protected void conditionalComment(System.Char find)
        {
            System.Int32 pos = this.input.IndexOf(find, this.index);
            if (pos < 0)
                pos = this.length;
            this.appendComment(pos, "//", find.ToString());
        }

        virtual protected void conditionalComment(System.String find)
        {
            System.Int32 pos = this.input.IndexOf(find, this.index);
            if (pos < 0)
                throw new MyMinException("Unterminated comment.");
            this.appendComment(pos, "/*", find);
        }

        virtual protected System.Char get()
        {
            System.Char c = this.ahead;
            this.ahead = MyMin.EOS;
            if (c == MyMin.EOS && this.index < this.length)
                c = this.input[this.index++];
            return (c == MyMin.EOS || c == MyMin.LF || c >= MyMin.SPACE) ? c : MyMin.SPACE;
        }

        virtual protected void init(System.String input, System.Boolean cc_on)
        {
            this.input = System.Text.RegularExpressions.Regex.Replace(input.Trim(), "(\n\r|\r\n|\r|\n)+", MyMin.LF.ToString());
            this.length = this.input.Length;
            this.cc_on = cc_on;
            this.a = MyMin.LF;
            this.action(3);
            while (this.a != MyMin.EOS)
            {
                switch (this.a)
                {
                    case MyMin.SPACE:
                        this.action(this.isAlNum(this.b) ? 1 : 2);
                        break;
                    case MyMin.LF:
                        switch (this.b)
                        {
                            case '{':
                            case '[':
                            case '(':
                            case '+':
                            case '-':
                                this.action(1);
                                break;
                            case MyMin.SPACE:
                                this.action(3);
                                break;
                            default:
                                this.action(this.isAlNum(this.b) ? 1 : 2);
                                break;
                        }
                        break;
                    default:
                        switch (this.b)
                        {
                            case MyMin.SPACE:
                                this.action(this.isAlNum(this.a) ? 1 : 3);
                                break;
                            case MyMin.LF:
                                switch (this.a)
                                {
                                    case '}':
                                    case ']':
                                    case ')':
                                    case '+':
                                    case '-':
                                    case '"':
                                    case '\'':
                                        this.action(1);
                                        break;
                                    default:
                                        this.action(this.isAlNum(this.a) ? 1 : 3);
                                        break;
                                }
                                break;
                            default:
                                this.action(1);
                                break;
                        }
                        break;
                }
            }
        }

        virtual protected System.Boolean isAlNum(System.Char c)
        {
            return c > 126 || c == '\\' || System.Text.RegularExpressions.Regex.IsMatch(c.ToString(), "^(\\w|\\$)$");
        }

        virtual protected System.Char next()
        {
            System.Char c = this.get();
            System.Boolean loop = true;
            if (c == '/')
            {
                switch (this.ahead = this.get())
                {
                    case '/':
                        if (this.cc_on && this.input[this.index] == '@')
                            this.conditionalComment(MyMin.LF);
                        while (loop)
                        {
                            c = this.get();
                            if (c <= MyMin.LF)
                                loop = false;
                        }
                        break;
                    case '*':
                        this.get();
                        if (this.cc_on && this.input[this.index] == '@')
                            this.conditionalComment("*/");
                        while (loop)
                        {
                            switch (this.get())
                            {
                                case '*':
                                    if ((this.ahead = this.get()) == '/')
                                    {
                                        this.get();
                                        c = MyMin.SPACE;
                                        loop = false;
                                    }
                                    break;
                                case MyMin.EOS:
                                    throw new MyMinException("Unterminated comment.");
                            }
                        }
                        break;
                }
            }
            return c;
        }

        virtual protected System.Boolean nextCharNoSlash(System.Char c, System.String message)
        {
            System.Boolean loop = true;
            this.a = this.get();
            if (this.a == c)
                loop = false;
            else
            {
                if (this.a == '\\')
                {
                    this.output.Append(this.a);
                    this.a = this.get();
                }
                if (this.a <= MyMin.LF)
                    throw new MyMinException(message);
            }
            return loop;
        }

        virtual protected System.Boolean spaceBeforeRegExp(System.String output)
        {
            System.Int32 i, length = output.Length;
            System.Boolean result = false;
            System.String tmp;
            System.String[] reserved = "case.else.in.return.typeof".Split('.');
            for (i = 0; i < 5 && !result; i++)
            {
                if (length == reserved[i].Length)
                    result = reserved[i] == output;
                else if (length > reserved[i].Length)
                {
                    tmp = output.Substring(length - reserved[i].Length - 1);
                    result = tmp.Substring(1) == reserved[i] && !this.isAlNum(tmp[0]);
                }
            }
            return length < 2 ? true : result;
        }
        #endregion
    }

    class MyMinCompressor
    {

        #region protected variables
        protected System.Int32 baseLength = 0;
        protected System.String baseString = "0123456789abcdefghijklmnopqrstuvwxyz";
        protected System.Collections.Generic.Dictionary<System.String, System.Int32> dict;
        protected System.Collections.Generic.Dictionary<System.String, System.String>[] list;
        protected System.String[] keywords;
        #endregion

        #region constructor
        public MyMinCompressor()
        {
            this.init(36);
        }

        public MyMinCompressor(System.Int32 baseLength)
        {
            this.init(baseLength);
        }
        #endregion

        #region public methods
        public System.String getCSSMachine(System.String css)
        {
            return this.getCSSMachine(css, System.String.Empty);
        }

        public System.String getCSSMachine(System.String css, System.String media)
        {
            System.Text.StringBuilder result = new System.Text.StringBuilder();
            result.Append("(function(M,y,m,i,n,C,S,s){if(m[n]){S=m.styleSheets;s=m.createElement(\"style\");s.type=\"text/css\";s.media=C||\"all\";M=M.replace(/\\w+/g,function(m){return y[parseInt(m,");
            result.Append(this.baseLength);
            result.Append(")]});m[n](\"head\")[0][i](s);/*@cc_on if(!(S[S.length-1].cssText=M))@*/s[i](m.createTextNode(M));m.write('<link hide=\"')}})('");
            result.Append(this.parse(css));
            result.Append("','");
            result.Append(System.String.Join(".", this.keywords));
            result.Append("'.split('.'),document,'appendChild','getElementsByTagName'");
            result.Append(media != System.String.Empty ? ",'" + media + "'" : "");
            result.Append(')');
            return result.ToString();
        }

        public System.String getJSMachine(System.String js)
        {
            System.Text.StringBuilder result = new System.Text.StringBuilder();
            result.Append("eval((function(M){return '");
            result.Append(this.parse(js));
            result.Append("'.replace(/\\w+/g,function(m){return M[parseInt(m,");
            result.Append(this.baseLength);
            result.Append(")]})})('");
            result.Append(System.String.Join(".", this.keywords));
            result.Append("'.split('.')))");
            return result.ToString();
        }

        public System.String getMachine(System.String js, System.String css)
        {
            return this.getMachine(js, css, System.String.Empty);
        }

        public System.String getMachine(System.String js, System.String css, System.String media)
        {
            System.Text.StringBuilder result = new System.Text.StringBuilder();
            System.String[] source;
            result.Append(js);
            result.Append(MyMin.EOS);
            result.Append(css);
            source = this.parse(result.ToString()).Split(MyMin.EOS);
            result = new System.Text.StringBuilder();
            result.Append("eval((function(M,y,m,i,n,C,S,s){if(m[n]){S=m.styleSheets;s=m.createElement(\"style\");s.type=\"text/css\";s.media=C||\"all\";C=M('");
            result.Append(source[1]);
            result.Append("',y);m[n](\"head\")[0][i](s);/*@cc_on if(!(S[S.length-1].cssText=C))@*/s[i](m.createTextNode(C));m.write('<link hide=\"')}return s?M('");
            result.Append(source[0]);
            result.Append("',y):\"\"})(function(s,l){return s.replace(/\\w+/g,function(m){return l[parseInt(m,");
            result.Append(this.baseLength);
            result.Append(")]})},'");
            result.Append(System.String.Join(".", this.keywords));
            result.Append("'.split('.'),document,'appendChild','getElementsByTagName'");
            result.Append(media != System.String.Empty ? ",'" + media + "'" : "");
            result.Append("))");
            return result.ToString();
        }
        #endregion

        #region virtual protected methods
        virtual protected System.String convertToBase(System.Int32 num)
        {
            System.Int32 module = 0;
            System.String result = "";
            while (num > 0)
            {
                result = this.baseString[(module = num % this.baseLength)].ToString() + result;
                num = (System.Int32)((num - module) / this.baseLength);
            }
            return result != "" ? result : this.baseString[0].ToString();
        }

        virtual protected System.String countMatches(System.Text.RegularExpressions.Match m)
        {
            if (!this.dict.ContainsKey(m.Value))
                this.dict.Add(m.Value, 0);
            this.dict[m.Value]++;
            return System.String.Empty;
        }

        virtual protected void init(System.Int32 baseLength)
        {
            this.baseLength = baseLength;
            this.baseString = this.baseString.Substring(0, baseLength);
        }

        virtual protected System.String parse(System.String source)
        {
            System.Int32 i = 0;
            System.Collections.Generic.Dictionary<System.String, System.String> tmp;
            this.dict = new System.Collections.Generic.Dictionary<System.String, System.Int32>();
            source = source.Replace("\\", "\\\\").Replace("'", "\\'");
            new System.Text.RegularExpressions.Regex(@"\w+").Replace(source, new System.Text.RegularExpressions.MatchEvaluator(this.countMatches));
            this.list = new System.Collections.Generic.Dictionary<System.String, System.String>[this.dict.Keys.Count];
            foreach (System.String key in this.dict.Keys)
            {
                tmp = new System.Collections.Generic.Dictionary<System.String, System.String>();
                tmp.Add("match", key);
                tmp.Add("count", this.dict[key].ToString());
                this.list[i++] = tmp;
            }
            this.sort();
            this.keywords = new System.String[i = this.list.Length];
            while (i-- > 0)
            {
                tmp = this.list[i];
                this.dict[this.keywords[i] = tmp["match"]] = i;
            }
            source = new System.Text.RegularExpressions.Regex(@"\w+").Replace(source, new System.Text.RegularExpressions.MatchEvaluator(this.replaceMatches));
            source = new System.Text.RegularExpressions.Regex("(\r\n|\n\r|\n|\r)+").Replace(source, "\\n");
            return source;
        }

        virtual protected System.String replaceMatches(System.Text.RegularExpressions.Match m)
        {
            return this.convertToBase(this.dict[m.Value]);
        }

        virtual protected void sort()
        {
            System.Boolean sorted = false;
            System.Collections.Generic.Dictionary<System.String, System.String> tmp;
            for (System.Int32 i = 1, j = this.list.Length; i < j; i++)
            {
                if (this.sortKeywords(this.list[i - 1], this.list[i]))
                {
                    sorted = true;
                    tmp = this.list[i];
                    this.list[i] = this.list[i - 1];
                    this.list[i - 1] = tmp;
                    i = i > 2 ? i - 2 : 0;
                }
            }
            if (sorted)
                this.sort();
        }

        virtual protected System.Boolean sortKeywords(
            System.Collections.Generic.Dictionary<System.String, System.String> a,
            System.Collections.Generic.Dictionary<System.String, System.String> b
        )
        {
            System.Int32 ac = System.Convert.ToInt32(a["count"]), bc = System.Convert.ToInt32(b["count"]);
            return (ac < bc) || (ac == bc && a["match"].Length < b["match"].Length);
        }
        #endregion
    }

    class MyMinCSS
    {

        #region protected variables
        protected System.String output;
        #endregion

        #region constructor
        public MyMinCSS(System.String input)
        {
            this.output = this.init(input, true);
        }

        public MyMinCSS(System.String input, System.Boolean cc_on)
        {
            this.output = this.init(input, cc_on);
        }
        #endregion

        #region public override methods
        public override System.String ToString()
        {
            return this.output.ToString().TrimEnd();
        }

        public static implicit operator System.String(MyMinCSS o)
        {
            return o.ToString();
        }
        #endregion

        #region virtual protected methods
        virtual protected System.Boolean action(System.Char c)
        {
            System.Boolean r = true;
            switch (c)
            {
                case '}':
                case '{':
                case ';':
                case ',':
                case ':':
                    r = false;
                    break;
            }
            return r;
        }

        virtual protected System.String init(System.String input, System.Boolean cc_on)
        {
            System.Char c;
            System.Text.StringBuilder output = new System.Text.StringBuilder();
            input = System.Text.RegularExpressions.Regex.Replace(input.Trim(), "(\\s)+", MyMin.SPACE.ToString());
            for (System.Int32 i = 0, l = input.Length; i < l; i++)
            {
                c = input[i];
                switch (c)
                {
                    case MyMin.SPACE:
                        if (++i < l)
                        {
                            if (this.action(input[i]))
                            {
                                if (-1 < (i - 2))
                                {
                                    if (this.action(input[i - 2]))
                                        output.Append(c);
                                }
                                else
                                    output.Append(c);
                            };
                            --i;
                        };
                        break;
                    case '/':
                        if (++i < l)
                        {
                            c = input[i];
                            if (c == '*')
                            {
                                if (++i < l)
                                {
                                    l = input.IndexOf("*/", i);
                                    if (-1 < l)
                                    {
                                        i = l + 2;
                                        l = input.Length;
                                        if (i < l)
                                        {
                                            --i;
                                            input = System.String.Format("{0};{1}", input.Substring(0, i), input.Substring(i + 1));
                                        }
                                    }
                                    else
                                        throw new MyMinException("Unterminated comment.");
                                }
                                else
                                    throw new MyMinException("Unterminated comment.");
                            }
                            else
                                output.Append(input[--i]);
                        };
                        break;
                    default:
                        output.Append(c);
                        break;
                }
            }
            return output.ToString().TrimEnd();
        }
        #endregion

    }

    class MyMinException : System.Exception
    {
        #region constructor
        public MyMinException(System.String message) : base(message) { }
        #endregion
    }
}
