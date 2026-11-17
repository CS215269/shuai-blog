/**
 * 站点数据源 —— 全部网址都在这里，改完保存、刷新页面即可生效。
 *
 * 结构：
 *   meta      : 站点标题 / 副标题前缀 / 更新日期
 *              （网址条数与分类数由页面自动统计，无需手写）
 *   categories: 分类数组
 *               key   分类标识（英文，小写）
 *               name  分类显示名
 *               desc  分类说明
 *               items 该分类下的网址
 *                     t  显示标题
 *                     u  网址
 *                     g  标签数组（用于筛选）
 *
 * 新增一条网址：在对应分类的 items 里加一行，例如
 *   { "t": "站点名", "u": "https://example.com", "g": ["标签1", "标签2"] }
 */
window.SITES = {
  "meta": {
    "title": "网址导航",
    "subtitle": "个人收藏夹",
    "updated": "2026-11-16"
  },
  "categories": [
    {
      "key": "dev",
      "name": "开发编程",
      "desc": "语言、算法、后端、脚本与版本控制",
      "items": [
        {
          "t": "55. 跳跃游戏 - 力扣 (LeetCode)",
          "u": "https://leetcode.cn/problems/jump-game/",
          "g": [
            "算法"
          ]
        },
        {
          "t": "APISpace 免费 API 接口大全",
          "u": "https://www.apispace.com/explore/service/?category_id=8&category_type=service",
          "g": [
            "API",
            "免费"
          ]
        },
        {
          "t": "Algolia 开发者文档",
          "u": "https://www.algolia.com/developers/?utm_content=powered_by&utm_source=v5.bootcss.com&utm_medium=referral&utm_campaign=docsearch",
          "g": [
            "搜索",
            "API"
          ]
        },
        {
          "t": "C 库函数 – memchr() | 菜鸟教程",
          "u": "https://www.runoob.com/cprogramming/c-function-memchr.html",
          "g": [
            "C/C++",
            "文档"
          ]
        },
        {
          "t": "C 语言网 - 编程入门学习",
          "u": "https://www.dotcpp.com/",
          "g": [
            "C/C++",
            "教程"
          ]
        },
        {
          "t": "C++ 入门教程 - 编程指南",
          "u": "http://c.biancheng.net/cplus/",
          "g": [
            "C/C++",
            "教程"
          ]
        },
        {
          "t": "Compiler Explorer",
          "u": "https://godbolt.org/",
          "g": [
            "开发",
            "C/C++"
          ]
        },
        {
          "t": "Git 本地仓库与远程仓库关联 - 博客园",
          "u": "https://www.cnblogs.com/xulinjun/p/12434778.html#:~:text=%E9%80%9A%E8%BF%87git,remote%20-v%E5%91%BD%E4%BB%A4%EF%BC%8C%E5%8F%AF%E4%BB%A5%E6%9F%A5%E7%9C%8B%E6%9C%AC%E5%9C%B0%E4%BB%93%E5%BA%93%E6%9C%89%E6%B2%A1%E6%9C%89%E4%B8%8E%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93%E8%BF%9B%E8%A1%8C%E5%85%B3%E8%81%94%E3%80%82",
          "g": [
            "Git",
            "教程"
          ]
        },
        {
          "t": "GitHub 排行榜 (OpenGithubs)",
          "u": "https://github.com/OpenGithubs",
          "g": [
            "GitHub"
          ]
        },
        {
          "t": "MSVC 编译错误与警告 - Microsoft Docs",
          "u": "https://docs.microsoft.com/zh-cn/cpp/error-messages/compiler-errors-1/c-cpp-build-errors?view=msvc-170",
          "g": [
            "C/C++",
            "开发"
          ]
        },
        {
          "t": "NewReleases - 软件版本追踪",
          "u": "https://newreleases.io/",
          "g": [
            "开发"
          ]
        },
        {
          "t": "Project Euler 欧拉计划",
          "u": "https://pe-cn.github.io/",
          "g": [
            "算法",
            "数学"
          ]
        },
        {
          "t": "Resend - 开发者邮件服务",
          "u": "https://resend.com/",
          "g": [
            "API"
          ]
        },
        {
          "t": "Spring Boot 中文文档",
          "u": "https://springdoc.cn/spring-boot/",
          "g": [
            "Spring",
            "文档"
          ]
        },
        {
          "t": "Spring 教程 | w3cschool",
          "u": "https://www.w3cschool.cn/wkspring/",
          "g": [
            "Spring",
            "教程"
          ]
        },
        {
          "t": "Wanderers.io 社区话题",
          "u": "https://wanderers.userecho.com/communities/1/topics/1091-httpswanderers-iodev",
          "g": [
            "社区",
            "开发"
          ]
        },
        {
          "t": "WordPress 插件目录",
          "u": "https://cn.wordpress.org/plugins/",
          "g": [
            "WordPress"
          ]
        },
        {
          "t": "__builtin_popcount() 使用及原理 - 博客园",
          "u": "https://www.cnblogs.com/ECJTUACM-873284962/p/7352303.html#:~:text=C%2FC%2B%2B%E4%B8%AD__builtin_popcount%20%28%29%E7%9A%84%E4%BD%BF%E7%94%A8%E5%8F%8A%E5%8E%9F%E7%90%86.%20__builtin_popcount%20%28%29%E7%94%A8%E4%BA%8E%E8%AE%A1%E7%AE%97%E4%B8%80%E4%B8%AA%2032%20%E4%BD%8D%E6%97%A0%E7%AC%A6%E5%8F%B7%E6%95%B4%E6%95%B0%E6%9C%89%E5%A4%9A%E5%B0%91%E4%B8%AA%E4%BD%8D%E4%B8%BA1.%20Counting%20out,the%20bits.%20%E5%8F%AF%E4%BB%A5%E5%BE%88%E5%AE%B9%E6%98%93%E7%9A%84%E5%88%A4%E6%96%AD%E4%B8%80%E4%B8%AA%E6%95%B0%E6%98%AF%E4%B8%8D%E6%98%AF2%E7%9A%84%E5%B9%82%E6%AC%A1%EF%BC%9A%E6%B8%85%E9%99%A4%E6%9C%80%E4%BD%8E%E7%9A%841%E4%BD%8D%EF%BC%88%E8%A7%81%E4%B8%8A%E9%9D%A2%EF%BC%89%E5%B9%B6%E4%B8%94%E6%A3%80%E6%9F%A5%E7%BB%93%E6%9E%9C%E6%98%AF%E4%B8%8D%E6%98%AF0.%E5%B0%BD%E7%AE%A1%E5%A6%82%E6%AD%A4%EF%BC%8C%E6%9C%89%E7%9A%84%E6%97%B6%E5%80%99%E9%9C%80%E8%A6%81%E7%9B%B4%E5%88%B0%E6%9C%89%E5%A4%9A%E5%B0%91%E4%B8%AA%E8%A2%AB%E8%AE%BE%E7%BD%AE%E4%BA%86%EF%BC%8C%E8%BF%99%E5%B0%B1%E7%9B%B8%E5%AF%B9%E6%9C%89%E7%82%B9%E9%9A%BE%E5%BA%A6%20%E4%BA%86%E3%80%82.%20GCC%E6%9C%89%E4%B8%80%E4%B8%AA%E5%8F%AB%E5%81%9A__builtin_popcount%E7%9A%84%E5%86%85%E5%BB%BA%E5%87%BD%E6%95%B0%EF%BC%8C%E5%AE%83%E5%8F%AF%E4%BB%A5%E7%B2%BE%E7%A1%AE%E7%9A%84%E8%AE%A1%E7%AE%971%E7%9A%84%E4%B8%AA%E6%95%B0%E3%80%82.%20%E5%B0%BD%E7%AE%A1%E5%A6%82%E6%AD%A4%EF%BC%8C%E4%B8%8D%E5%90%8C%E4%BA%8E__builtin_ctz%EF%BC%8C%E5%AE%83%E5%B9%B6%E6%B2%A1%E6%9C%89%E8%A2%AB%20%E7%BF%BB%E8%AF%91%E6%88%90%E4%B8%80%E4%B8%AA%E7%A1%AC%E4%BB%B6%E6%8C%87%E4%BB%A4%EF%BC%88%E8%87%B3%E5%B0%91%E5%9C%A8x86%E4%B8%8A%E4%B8%8D%E6%98%AF%EF%BC%89%E3%80%82.%20%E7%9B%B8%E5%8F%8D%E7%9A%84%EF%BC%8C%E5%AE%83%E4%BD%BF%E7%94%A8%E4%B8%80%E5%BC%A0%E7%B1%BB%E4%BC%BC%E4%B8%8A%E9%9D%A2%E6%8F%90%E5%88%B0%E7%9A%84%E5%9F%BA%E4%BA%8E%E8%A1%A8%E7%9A%84%E6%96%B9%E6%B3%95%E6%9D%A5%E8%BF%9B%E8%A1%8C%E4%BD%8D%E6%90%9C%E7%B4%A2%E3%80%82.",
          "g": [
            "C/C++",
            "算法"
          ]
        },
        {
          "t": "cplusplus.com - C++ 资源网络",
          "u": "http://www.cplusplus.com/",
          "g": [
            "C/C++",
            "资源"
          ]
        },
        {
          "t": "cppreference.com - C++ 参考",
          "u": "https://en.cppreference.com/w/",
          "g": [
            "C/C++",
            "文档"
          ]
        },
        {
          "t": "qqbot · GitHub Topics",
          "u": "https://github.com/topics/qqbot",
          "g": [
            "GitHub"
          ]
        },
        {
          "t": "免费部署 Docker 服务的服务商 - V2EX",
          "u": "https://v2ex.com/t/1171942#reply4",
          "g": [
            "Docker",
            "部署"
          ]
        },
        {
          "t": "油猴脚本开发指南教程目录",
          "u": "https://bbs.tampermonkey.net.cn/thread-184-1-1.html",
          "g": [
            "脚本"
          ]
        },
        {
          "t": "算法可视化工具",
          "u": "https://algorithm-visualizer.org/",
          "g": [
            "算法",
            "可视化"
          ]
        },
        {
          "t": "自建网站的多种姿势 - 云牧",
          "u": "https://www.cnblogs.com/yunmuq/p/14586647.html",
          "g": [
            "部署",
            "教程"
          ]
        }
      ]
    },
    {
      "key": "frontend",
      "name": "前端与 UI",
      "desc": "HTML/CSS、H5、后台模板、框架与组件",
      "items": [
        {
          "t": "27 个精致的 CSS3 动画效果",
          "u": "https://www.w3cschool.cn/css3/css3-animation.html",
          "g": [
            "HTML/CSS"
          ]
        },
        {
          "t": "AdminLTE 高级后台模板",
          "u": "https://adminlte.io/premium/",
          "g": [
            "模板"
          ]
        },
        {
          "t": "AdminMart 免费后台模板",
          "u": "https://adminmart.com/templates/free-admin-templates/",
          "g": [
            "模板",
            "免费"
          ]
        },
        {
          "t": "Ant Design Pro 中台前端方案",
          "u": "https://pro.ant.design/zh-CN/",
          "g": [
            "Ant Design"
          ]
        },
        {
          "t": "Anthony Fu 的博客",
          "u": "https://antfu.me/posts",
          "g": [
            "Vue",
            "社区"
          ]
        },
        {
          "t": "BBBootstrap - HTML & CSS 网站模板",
          "u": "https://bbbootstrap.com/templates/html-css-website-templates-5692908",
          "g": [
            "HTML/CSS",
            "模板"
          ]
        },
        {
          "t": "Bootstrap 官方文档",
          "u": "https://getbootstrap.com/",
          "g": [
            "Bootstrap",
            "文档"
          ]
        },
        {
          "t": "Bootstrap 环境安装 | 菜鸟教程",
          "u": "https://www.runoob.com/bootstrap/bootstrap-environment-setup.html",
          "g": [
            "Bootstrap",
            "教程"
          ]
        },
        {
          "t": "BootstrapMade - 免费 Bootstrap 模板",
          "u": "https://bootstrapmade.com/",
          "g": [
            "Bootstrap",
            "模板"
          ]
        },
        {
          "t": "Bootswatch - Bootstrap 主题",
          "u": "https://bootswatch.com/",
          "g": [
            "Bootstrap"
          ]
        },
        {
          "t": "BuildAdmin 后台框架文档",
          "u": "https://doc.buildadmin.com/",
          "g": [
            "模板",
            "Vue"
          ]
        },
        {
          "t": "CSS3 Generator",
          "u": "http://css3generator.com/",
          "g": [
            "HTML/CSS",
            "生成器"
          ]
        },
        {
          "t": "CodePen 在线代码编辑器",
          "u": "https://codepen.io/",
          "g": [
            "示例"
          ]
        },
        {
          "t": "Creative Tim - Bootstrap 免费主题",
          "u": "https://www.creative-tim.com/bootstrap-themes/free?page=5",
          "g": [
            "Bootstrap",
            "模板"
          ]
        },
        {
          "t": "DCloud - HBuilderX / uni-app",
          "u": "https://dcloud.io/",
          "g": [
            "H5"
          ]
        },
        {
          "t": "Element Plus 图标库",
          "u": "https://element-plus.org/en-US/component/icon.html#icon-collection",
          "g": [
            "Element Plus",
            "图标"
          ]
        },
        {
          "t": "Fractal 静态博客入门指南",
          "u": "https://fractal.build/guide/getting-started.html#the-from-scratch-method",
          "g": [
            "教程"
          ]
        },
        {
          "t": "H5模板在线制作设计_H5素材图片免费下载_MAKA",
          "u": "https://www.maka.im/muban/t2149.html",
          "g": [
            "H5",
            "模板"
          ]
        },
        {
          "t": "Layoutit Grid - CSS Grid 可视化生成器",
          "u": "https://grid.layoutit.com/",
          "g": [
            "HTML/CSS",
            "生成器"
          ]
        },
        {
          "t": "MD Bootstrap - Bootstrap 5 + Material Design",
          "u": "https://mdbootstrap.com/docs/standard/#demo",
          "g": [
            "Bootstrap",
            "Material"
          ]
        },
        {
          "t": "MDN Web Docs",
          "u": "https://developer.mozilla.org/zh-CN/",
          "g": [
            "文档"
          ]
        },
        {
          "t": "RuoYi 后台管理系统文档",
          "u": "https://doc.ruoyi.vip/",
          "g": [
            "模板",
            "Java"
          ]
        },
        {
          "t": "Start Bootstrap - 模板与指南",
          "u": "https://startbootstrap.com/?showPro=false&showAngular=false&showVue=false",
          "g": [
            "Bootstrap",
            "模板"
          ]
        },
        {
          "t": "Tailwind CSS 中文文档",
          "u": "https://www.tailwindcss.cn/",
          "g": [
            "Tailwind",
            "HTML/CSS"
          ]
        },
        {
          "t": "Uiverse - HTML CSS 表单集合",
          "u": "https://uiverse.io/forms",
          "g": [
            "HTML/CSS",
            "办公"
          ]
        },
        {
          "t": "V3 Admin Vite 教程",
          "u": "https://juejin.cn/column/7207659644487139387",
          "g": [
            "模板",
            "Vue"
          ]
        },
        {
          "t": "Vue Element Plus Admin 后台模板",
          "u": "https://element-plus-admin-doc.cn/",
          "g": [
            "Vue",
            "Element Plus"
          ]
        },
        {
          "t": "iView Admin 后台模板",
          "u": "https://admin.iviewui.com/join/join_page",
          "g": [
            "Vue",
            "模板"
          ]
        },
        {
          "t": "iView Admin 文档",
          "u": "https://lison16.github.io/iview-admin-doc/#/",
          "g": [
            "Vue",
            "文档"
          ]
        }
      ]
    },
    {
      "key": "ai",
      "name": "AI 工具",
      "desc": "大模型、提示词、生成式工具",
      "items": [
        {
          "t": "Animaker 在线动画视频",
          "u": "https://app.animaker.com/editproject/TnZ5F3fPL0H5N52t",
          "g": [
            "AI 视频"
          ]
        },
        {
          "t": "ChatGPT for Bot 使用文档",
          "u": "https://chatgpt-qq.lss233.com/",
          "g": [
            "AI",
            "部署"
          ]
        },
        {
          "t": "InVideo 在线视频编辑器",
          "u": "https://invideo.io/",
          "g": [
            "AI 视频"
          ]
        },
        {
          "t": "LangChain 中文网 · LLM 应用开发文档",
          "u": "https://www.langchain.com.cn/",
          "g": [
            "AI",
            "文档"
          ]
        },
        {
          "t": "Pictory - 文生视频",
          "u": "https://app.pictory.ai/textinput",
          "g": [
            "AI 视频"
          ]
        },
        {
          "t": "Pictory - 视频营销",
          "u": "https://pictory.ai/",
          "g": [
            "AI 视频"
          ]
        },
        {
          "t": "Runway Gen-1 视频转视频",
          "u": "https://app.runwayml.com/video-tools/teams/shuaichen/ai-tools/gen-1",
          "g": [
            "AI 视频"
          ]
        },
        {
          "t": "Skeleton Loading Screen · AI Prompt",
          "u": "https://design.dev/ai/prompts/skeleton-loading-screen/",
          "g": [
            "AI"
          ]
        },
        {
          "t": "Wipely - NotebookLM 编辑神器",
          "u": "https://www.wipelyai.cv/zh",
          "g": [
            "AI",
            "PPT"
          ]
        },
        {
          "t": "一帧秒 - AI 视频创作",
          "u": "https://aigc.yizhentv.com/index.html",
          "g": [
            "AI 视频"
          ]
        },
        {
          "t": "流明5 Lumen5 视频生成",
          "u": "https://lumen5.com/app/?id=7711344#creator",
          "g": [
            "AI 视频"
          ]
        }
      ]
    },
    {
      "key": "learn",
      "name": "学习教程",
      "desc": "系统教程、文档、课程与知识库",
      "items": [
        {
          "t": "PKMer 学术指南 - 知识管理工具",
          "u": "https://pkmer.cn/Pkmer-Docs/03-%E7%9F%A5%E8%AF%86%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7/%E6%96%87%E6%A1%A3%E8%BD%AC%E6%8D%A2/pandoc%E5%AD%A6%E6%9C%AF%E6%8C%87%E5%8D%97/",
          "g": [
            "学习"
          ]
        },
        {
          "t": "Screeps - MMO 编程策略沙盒",
          "u": "https://screeps.com/",
          "g": [
            "学习",
            "开发"
          ]
        },
        {
          "t": "V3 Admin Vite 中文文档",
          "u": "https://juejin.cn/post/7089377403717287972",
          "g": [
            "文档"
          ]
        },
        {
          "t": "WIN10 彻底关闭自动更新 - 知乎",
          "u": "https://zhuanlan.zhihu.com/p/391195241",
          "g": [
            "Windows"
          ]
        },
        {
          "t": "w3school 在线教程",
          "u": "https://www.w3school.com.cn/",
          "g": [
            "教程",
            "中文"
          ]
        },
        {
          "t": "前端学习路线",
          "u": "https://objtube.github.io/front-end-roadmap/?ref=www.tboxn.com#/",
          "g": [
            "教程"
          ]
        },
        {
          "t": "华文慕课",
          "u": "https://www.chinesemooc.org/index.php",
          "g": [
            "教程",
            "中文"
          ]
        },
        {
          "t": "开源计算机编程书籍",
          "u": "https://github.com/justjavac/free-programming-books-zh_CN#cc",
          "g": [
            "教程",
            "开源"
          ]
        },
        {
          "t": "慕课网 – 程序员的梦工厂",
          "u": "https://www.imooc.com/",
          "g": [
            "教程",
            "中文"
          ]
        }
      ]
    },
    {
      "key": "design",
      "name": "设计创意",
      "desc": "配色、图标、素材、模板与灵感",
      "items": [
        {
          "t": "0to255 - 颜色拾取器",
          "u": "https://0to255.com/",
          "g": [
            "配色"
          ]
        },
        {
          "t": "Adobe Photoshops 2023 Beta 版下载Win/Mac，用AI帮你做设计！PS Beta AI版终于来了！ - 幕后Muhou",
          "u": "https://muhou.net/242718.html",
          "g": [
            "设计"
          ]
        },
        {
          "t": "Canva 可画 - Logo 模板",
          "u": "https://www.canva.cn/templates/?continuation=150",
          "g": [
            "素材",
            "模板"
          ]
        },
        {
          "t": "Colorpoint - 调色板",
          "u": "https://www.colorpoint.io/",
          "g": [
            "配色"
          ]
        },
        {
          "t": "Eva Design System 配色生成器",
          "u": "https://colors.eva.design/",
          "g": [
            "配色",
            "生成器"
          ]
        },
        {
          "t": "Freepik - 矢量、照片与 PSD 素材",
          "u": "https://www.freepik.com/",
          "g": [
            "素材"
          ]
        },
        {
          "t": "H5 案例作品 - Epub360",
          "u": "https://www.epub360.com/portfolio/20!30!0!0!0!!!/",
          "g": [
            "H5",
            "示例"
          ]
        },
        {
          "t": "H5 案例分享",
          "u": "https://www.h5anli.com/",
          "g": [
            "H5",
            "示例"
          ]
        },
        {
          "t": "H5 素材包推荐 - 知乎",
          "u": "https://zhuanlan.zhihu.com/p/28949033",
          "g": [
            "H5",
            "素材"
          ]
        },
        {
          "t": "H5DS - H5 编辑器",
          "u": "https://www.h5ds.com/template",
          "g": [
            "H5",
            "编辑器"
          ]
        },
        {
          "t": "Material Design 3",
          "u": "https://m3.material.io/",
          "g": [
            "Material"
          ]
        },
        {
          "t": "Material UI 官方站",
          "u": "https://materialui.co/colors/",
          "g": [
            "配色",
            "Material"
          ]
        },
        {
          "t": "Paletton - 配色方案生成器",
          "u": "http://paletton.com/#uid=52W0h0kA+ILkVM3qUJNIkt+J8nh",
          "g": [
            "配色",
            "生成器"
          ]
        },
        {
          "t": "h5 图片大全 - 包图网",
          "u": "https://ibaotu.com/tupian/h5.html",
          "g": [
            "H5",
            "素材"
          ]
        },
        {
          "t": "h5 模板与素材 - 素材公社",
          "u": "https://www.tooopen.com/ui/1051_1052.html",
          "g": [
            "H5",
            "模板"
          ]
        },
        {
          "t": "iSlide - PPT 模板与美化",
          "u": "https://www.islide.cc/",
          "g": [
            "PPT",
            "模板"
          ]
        },
        {
          "t": "Material UI 官方站",
          "u": "https://materialui.co/",
          "g": [
            "配色"
          ]
        },
        {
          "t": "人人秀 - 营销玩法大全",
          "u": "https://rrx.cn/doc",
          "g": [
            "运营",
            "H5"
          ]
        },
        {
          "t": "创客贴 - 在线平面设计作图",
          "u": "https://www.chuangkit.com/",
          "g": [
            "素材"
          ]
        },
        {
          "t": "北测数字",
          "u": "http://rmt.szbc.net/rm/home/index",
          "g": [
            "H5"
          ]
        },
        {
          "t": "在线 ICO 图标生成",
          "u": "https://www.butterpig.top/ico/",
          "g": [
            "图标",
            "生成器"
          ]
        },
        {
          "t": "易企秀 - H5 制作与营销",
          "u": "https://www.eqxiu.com/",
          "g": [
            "H5",
            "模板"
          ]
        },
        {
          "t": "有哪些更全面的 H5 素材网站 - 知乎",
          "u": "https://www.zhihu.com/question/47725220",
          "g": [
            "H5",
            "素材"
          ]
        },
        {
          "t": "编辑 H5 作品 - 北测数字",
          "u": "http://rmt.szbc.net/animation/edit/64f189f0d848bfb2e4021935",
          "g": [
            "H5",
            "编辑器"
          ]
        },
        {
          "t": "考试须知 -  Mugeda",
          "u": "https://edu.mugeda.com/apply_designer.php",
          "g": [
            "H5",
            "考试"
          ]
        },
        {
          "t": "花瓣 - 设计灵感与素材",
          "u": "https://huaban.com/",
          "g": [
            "素材"
          ]
        }
      ]
    },
    {
      "key": "tools",
      "name": "工具箱",
      "desc": "在线小工具、PDF、思维导图、地图与生成器",
      "items": [
        {
          "t": "123Apps 在线文件工具",
          "u": "https://123apps.com/cn/",
          "g": [
            "工具"
          ]
        },
        {
          "t": "16Personalities 性格测试",
          "u": "https://www.16personalities.com/ch",
          "g": [
            "工具"
          ]
        },
        {
          "t": "BT 种子分析 - 在线工具",
          "u": "https://tool.lu/torrent/",
          "g": [
            "资源"
          ]
        },
        {
          "t": "Coggle - 思维导图",
          "u": "https://coggle.it/",
          "g": [
            "思维导图"
          ]
        },
        {
          "t": "Ethereal Email - 临时邮箱",
          "u": "https://ethereal.email/",
          "g": [
            "临时邮箱"
          ]
        },
        {
          "t": "GeoGebra 免费数学软件",
          "u": "https://www.geogebra.org/",
          "g": [
            "数学"
          ]
        },
        {
          "t": "Human Benchmark - 反应速度测试",
          "u": "https://humanbenchmark.com/",
          "g": [
            "工具"
          ]
        },
        {
          "t": "MindOnMap 思维导图",
          "u": "https://m.mindonmap.com/pages/basics/newmap",
          "g": [
            "思维导图"
          ]
        },
        {
          "t": "O-UU Mail 一次性邮箱",
          "u": "https://o-uu.com/inbox",
          "g": [
            "临时邮箱"
          ]
        },
        {
          "t": "SearXNG 聚合搜索引擎",
          "u": "https://searx.bndkt.io/",
          "g": [
            "搜索"
          ]
        },
        {
          "t": "SimilarSites - 找相似网站",
          "u": "https://www.similarsites.com/",
          "g": [
            "搜索"
          ]
        },
        {
          "t": "Smallpdf - PDF 一站式处理",
          "u": "https://smallpdf.com/cn",
          "g": [
            "PDF"
          ]
        },
        {
          "t": "Temp Mail 一次性临时邮箱",
          "u": "https://temp-mail.io/zh",
          "g": [
            "临时邮箱"
          ]
        },
        {
          "t": "WebTools - 开发者在线工具",
          "u": "https://yesapi.cn/web-tools/index.php",
          "g": [
            "工具"
          ]
        },
        {
          "t": "Wolfram|Alpha 计算知识引擎",
          "u": "https://www.wolframalpha.com/",
          "g": [
            "数学",
            "学习"
          ]
        },
        {
          "t": "draw.io 在线图表工具",
          "u": "https://www.drawio.com/",
          "g": [
            "工具"
          ]
        },
        {
          "t": "floccus - 坚果云书签同步",
          "u": "https://www.jianguoyun.com/#/sandbox/1bb1a6c/798daabd5bb5b2a7/%2F/",
          "g": [
            "工具"
          ]
        },
        {
          "t": "个人技术分享",
          "u": "https://qrbtf.com/",
          "g": [
            "开发",
            "工具"
          ]
        },
        {
          "t": "中央气象台天气接口",
          "u": "http://www.nmc.cn/rest/weather?stationid=VjERZ",
          "g": [
            "工具",
            "API"
          ]
        },
        {
          "t": "全国城市空气质量实时数据接口",
          "u": "https://air.cnemc.cn:18007/CityData/GetAQIDataPublishLiveInfo?cityCode=340200",
          "g": [
            "工具",
            "API"
          ]
        },
        {
          "t": "吾道 - 工作台",
          "u": "https://www.woodo.cn/home/",
          "g": [
            "工具"
          ]
        },
        {
          "t": "标准地图服务系统",
          "u": "http://bzdt.ch.mnr.gov.cn/",
          "g": [
            "工具"
          ]
        },
        {
          "t": "爱站 - 站长 SEO 权重查询",
          "u": "https://www.aizhan.com/",
          "g": [
            "搜索"
          ]
        },
        {
          "t": "舒尔特方格 Schulte Grid",
          "u": "https://www.shuerte.com/",
          "g": [
            "工具"
          ]
        },
        {
          "t": "蓝奏云 - 云存储与上传",
          "u": "https://pc.woozooo.com/mydisk.php",
          "g": [
            "网盘"
          ]
        }
      ]
    },
    {
      "key": "discover",
      "name": "发现应用",
      "desc": "新软件、好应用、资讯与下载源",
      "items": [
        {
          "t": "APK Downloader - Google Play 应用直下",
          "u": "https://apkdownloader.pages.dev/",
          "g": [
            "Android",
            "下载"
          ]
        },
        {
          "t": "AlternativeTo - 软件替代方案",
          "u": "https://alternativeto.net/",
          "g": [
            "发现"
          ]
        },
        {
          "t": "ApkPure - Android 应用下载",
          "u": "https://apkpure.com/app",
          "g": [
            "Android"
          ]
        },
        {
          "t": "BetaList",
          "u": "https://betalist.com/",
          "g": [
            "发现",
            "英文"
          ]
        },
        {
          "t": "Crx 搜搜 - 扩展与应用商店",
          "u": "https://www.crxsoso.com/",
          "g": [
            "下载"
          ]
        },
        {
          "t": "F-Droid 开源 Android 应用仓库",
          "u": "https://f-droid.org/zh_Hans/",
          "g": [
            "Android",
            "开源"
          ]
        },
        {
          "t": "FileHippo",
          "u": "https://filehippo.com/",
          "g": [
            "工具",
            "下载"
          ]
        },
        {
          "t": "IT之家软件站",
          "u": "https://soft.ithome.com/",
          "g": [
            "资讯",
            "下载"
          ]
        },
        {
          "t": "Lifehacker",
          "u": "https://lifehacker.com/",
          "g": [
            "资讯"
          ]
        },
        {
          "t": "MakeUseOf",
          "u": "https://www.makeuseof.com/",
          "g": [
            "资讯"
          ]
        },
        {
          "t": "Microsoft Store",
          "u": "https://www.microsoft.com/zh-cn/",
          "g": [
            "下载",
            "Windows"
          ]
        },
        {
          "t": "Product Hunt",
          "u": "https://www.producthunt.com/",
          "g": [
            "发现",
            "英文"
          ]
        },
        {
          "t": "RuTracker 资源论坛",
          "u": "https://rutracker.net/forum/index.php",
          "g": [
            "资源",
            "社区"
          ]
        },
        {
          "t": "Slant",
          "u": "https://www.slant.co/",
          "g": [
            "社区",
            "英文"
          ]
        },
        {
          "t": "SourceForge 开源软件站",
          "u": "https://sourceforge.net/",
          "g": [
            "开源",
            "下载"
          ]
        },
        {
          "t": "V2EX 发现",
          "u": "https://v2ex.com/go/share",
          "g": [
            "社区",
            "发现"
          ]
        },
        {
          "t": "乐愚社区",
          "u": "https://bbs.leyuz.net/",
          "g": [
            "社区"
          ]
        },
        {
          "t": "华军软件园 - 绿色软件下载",
          "u": "https://www.onlinedown.net/",
          "g": [
            "下载",
            "绿色"
          ]
        },
        {
          "t": "卡饭论坛",
          "u": "https://bbs.kafan.cn/",
          "g": [
            "社区"
          ]
        },
        {
          "t": "发现小众",
          "u": "https://meta.appinn.net/",
          "g": [
            "发现"
          ]
        },
        {
          "t": "吾爱破解",
          "u": "https://www.52pojie.cn/",
          "g": [
            "破解",
            "社区"
          ]
        },
        {
          "t": "学破解",
          "u": "https://www.xuepojie.com/",
          "g": [
            "破解",
            "社区"
          ]
        },
        {
          "t": "小众软件",
          "u": "https://www.appinn.com/",
          "g": [
            "下载",
            "Windows"
          ]
        },
        {
          "t": "小猿助理 - 免积分下载",
          "u": "https://dl.zzyyww.cn/",
          "g": [
            "下载"
          ]
        },
        {
          "t": "少数派",
          "u": "https://sspai.com/",
          "g": [
            "资讯"
          ]
        },
        {
          "t": "异次元软件世界",
          "u": "https://www.iplaysoft.com/",
          "g": [
            "下载",
            "Windows"
          ]
        },
        {
          "t": "新趣集",
          "u": "https://xinquji.com/",
          "g": [
            "资讯"
          ]
        },
        {
          "t": "远景论坛",
          "u": "https://bbs.pcbeta.com/",
          "g": [
            "社区",
            "Windows"
          ]
        }
      ]
    },
    {
      "key": "nav",
      "name": "导航站",
      "desc": "各类网址导航与资源聚合",
      "items": [
        {
          "t": "Latent Box - Stable Diffusion 生态论文",
          "u": "https://latentbox.com/zh/sd-ecology",
          "g": [
            "导航",
            "AI"
          ]
        },
        {
          "t": "MoreThing 导航",
          "u": "https://morething.top/",
          "g": [
            "导航"
          ]
        },
        {
          "t": "Tbox 导航",
          "u": "https://www.tboxn.com/",
          "g": [
            "导航"
          ]
        },
        {
          "t": "图欧学习资源导航",
          "u": "https://tuostudy.upnb.top/",
          "g": [
            "导航",
            "学习"
          ]
        },
        {
          "t": "大麦搜",
          "u": "https://dama.lu/",
          "g": [
            "导航"
          ]
        },
        {
          "t": "完美网址导航 9EIP",
          "u": "https://www.9eip.com/",
          "g": [
            "导航"
          ]
        },
        {
          "t": "小众技术工具库",
          "u": "https://www.xiaozhongjishu.com/",
          "g": [
            "导航"
          ]
        },
        {
          "t": "爱达杂货铺",
          "u": "https://adzhp.net/",
          "g": [
            "导航"
          ]
        },
        {
          "t": "简约导航",
          "u": "https://www.jianavi.com/",
          "g": [
            "导航"
          ]
        },
        {
          "t": "资源之家",
          "u": "https://ziyuan.cn/",
          "g": [
            "导航",
            "资源"
          ]
        }
      ]
    },
    {
      "key": "academic",
      "name": "学业校园",
      "desc": "考研、论文、竞赛与教学平台",
      "items": [
        {
          "t": "HaoYo - 模拟研招网调剂系统",
          "u": "http://xn--mnqs00c24c2pw0ii.com/miniPrograms/sort",
          "g": [
            "考研"
          ]
        },
        {
          "t": "OpenReview - 会议投稿与评审",
          "u": "https://openreview.net/",
          "g": [
            "论文"
          ]
        },
        {
          "t": "RateYourSupervisor - 导师评价",
          "u": "https://www.rateyoursupervisor.com/",
          "g": [
            "导师"
          ]
        },
        {
          "t": "三角恒等式 - 中文数学 Wiki",
          "u": "https://math.fandom.com/zh/wiki/%E4%B8%89%E8%A7%92%E6%81%92%E7%AD%89%E5%BC%8F#:~:text=%E5%92%8C%E5%B7%AE%E8%A7%92%E5%85%AC%E5%BC%8F%E6%98%AF%E6%9C%80%E5%9F%BA%E6%9C%AC%E7%9A%84",
          "g": [
            "数学",
            "学习"
          ]
        },
        {
          "t": "中国教育在线 - 硕士招生服务平台",
          "u": "https://kaoyan.eol.cn/mky_2391.html",
          "g": [
            "考研"
          ]
        },
        {
          "t": "全国硕士研究生招生信息公开平台",
          "u": "https://yz.chsi.com.cn/zsgs/",
          "g": [
            "考研"
          ]
        },
        {
          "t": "南信大学研招生信息网",
          "u": "https://yzb.nuist.edu.cn/sszs/tzgg.htm",
          "g": [
            "考研",
            "校园"
          ]
        },
        {
          "t": "合肥师范学院就业创业工作网",
          "u": "https://jycy.hfnu.edu.cn/",
          "g": [
            "校园"
          ]
        },
        {
          "t": "基于 Java Web 的人事管理系统设计 - CNKI",
          "u": "https://www.cnki.com.cn/Article/CJFDTOTAL-GWDZ202024021.htm",
          "g": [
            "论文"
          ]
        },
        {
          "t": "大木虫学术导航 - 文献下载",
          "u": "http://www.4243.net/",
          "g": [
            "论文",
            "下载"
          ]
        },
        {
          "t": "导师简介 - 南京邮电大学",
          "u": "https://yjs.njupt.edu.cn/dsgl/nocontrol/college/dsfcxq.htm?dsJbxxId=9B9D05C52A072DCFE050007F01006EFE",
          "g": [
            "导师",
            "校园"
          ]
        },
        {
          "t": "我爱竞赛 - 全国大学生比赛网",
          "u": "http://yssjxy.zsc.edu.cn/yssjxy/jsxx/resource/1co9tnf0incb6.php",
          "g": [
            "竞赛"
          ]
        },
        {
          "t": "数学公式计算 - 限制与逐步计算",
          "u": "https://mathdf.com/lim/cn/",
          "g": [
            "数学"
          ]
        },
        {
          "t": "比赛题库",
          "u": "http://mokit.top/problem/list",
          "g": [
            "竞赛"
          ]
        },
        {
          "t": "考研信息网",
          "u": "https://www.chinakaoyan.com/",
          "g": [
            "考研",
            "资讯"
          ]
        },
        {
          "t": "考试酷 - 在线考试与作业系统",
          "u": "https://examcoo.com/",
          "g": [
            "考试",
            "教学"
          ]
        },
        {
          "t": "赛氪竞赛网 - 全国大学生比赛信息",
          "u": "https://www.saikr.com/",
          "g": [
            "竞赛"
          ]
        },
        {
          "t": "超星期刊",
          "u": "https://qikan.chaoxing.com/",
          "g": [
            "论文"
          ]
        }
      ]
    },
    {
      "key": "work",
      "name": "工作办公",
      "desc": "文档协作、办公套件与效率工具",
      "items": [
        {
          "t": "Microsoft 365 免费办公应用",
          "u": "https://www.microsoft.com/zh-cn/microsoft-365/free-productivity-apps",
          "g": [
            "办公",
            "免费"
          ]
        }
      ]
    },
    {
      "key": "network",
      "name": "网络与代理",
      "desc": "VPN、节点、代理与网络配置",
      "items": [
        {
          "t": "ORYMI 导航站",
          "u": "https://orymi.cc/#/register?code=rDsEp8Hf",
          "g": [
            "代理"
          ]
        },
        {
          "t": "SwitchyOmega 下载",
          "u": "https://switchyomega.org/switchyomega-download/",
          "g": [
            "代理"
          ]
        },
        {
          "t": "clashfree - 免费 Clash 节点",
          "u": "https://github.com/free-nodes/clashfree?tab=readme-ov-file",
          "g": [
            "代理"
          ]
        },
        {
          "t": "hidemy.name - 免费 VPN 服务",
          "u": "https://hidemy.io/cn/",
          "g": [
            "免费"
          ]
        },
        {
          "t": "nginx HTTPS 反向代理 - 黯羽轻扬",
          "u": "http://www.ayqy.net/blog/nginx-https%e5%8f%8d%e5%90%91%e4%bb%a3%e7%90%86/",
          "g": [
            "代理"
          ]
        }
      ]
    },
    {
      "key": "life",
      "name": "生活娱乐",
      "desc": "影视、音乐、壁纸与社区",
      "items": [
        {
          "t": "33 台词 - 通过台词找电影",
          "u": "http://33.agilestudio.cn/?subtitleKeyword=%E5%93%88%E5%93%88%E5%93%88%E5%93%88&exactFlag=0&phraseMode=0&page=1&limit=20",
          "g": [
            "影视"
          ]
        },
        {
          "t": "5120x3200 壁纸专辑页 3 |10wallpaper.com",
          "u": "https://10wallpaper.com/5120x3200_wallpapers/page/3",
          "g": [
            "壁纸"
          ]
        },
        {
          "t": "6v 电影网",
          "u": "http://www.6vhao.tv/",
          "g": [
            "影视",
            "下载"
          ]
        },
        {
          "t": "LINUX DO",
          "u": "https://linux.do/",
          "g": [
            "社区"
          ]
        },
        {
          "t": "MX 动漫",
          "u": "http://www.mxdm8.com/",
          "g": [
            "影视"
          ]
        },
        {
          "t": "RawChat 公益聊天站点",
          "u": "https://sharedchat.fun/",
          "g": [
            "社交"
          ]
        },
        {
          "t": "SS's Trace - 开卷有益",
          "u": "https://sst.st/",
          "g": [
            "社区",
            "开发"
          ]
        },
        {
          "t": "一起听歌 - 和喜欢的人听同一首歌",
          "u": "https://qqovo.top/",
          "g": [
            "音乐"
          ]
        },
        {
          "t": "两个BT - 影视下载与分享",
          "u": "https://www.bttwo.com/",
          "g": [
            "影视",
            "资源"
          ]
        },
        {
          "t": "乌云高清壁纸站",
          "u": "http://www.obzhi.com/page/2",
          "g": [
            "壁纸"
          ]
        },
        {
          "t": "在线之家 - 美剧韩剧",
          "u": "https://www.zxzja.com/",
          "g": [
            "影视"
          ]
        },
        {
          "t": "找台",
          "u": "http://www.zhaotaici.cn/",
          "g": [
            "影视"
          ]
        },
        {
          "t": "有哪些较好的壁纸网站 - 知乎",
          "u": "https://www.zhihu.com/question/32762402/answer/58707616",
          "g": [
            "壁纸"
          ]
        },
        {
          "t": "硬核影视指南",
          "u": "https://yinghe.app/",
          "g": [
            "影视"
          ]
        }
      ]
    }
  ]
};
