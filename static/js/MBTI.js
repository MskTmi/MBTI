$(document).ready(function () {

    var answers = [];

    //获取题目
    $.ajax({
        type: "get",
        url: `./data/output.txt`,
        async: false,
        success: function (data) {
            var data = JSON.parse(data);
            data.forEach((item, index) => {
                let display = index === 0 ? "block" : "none";

                $("#mbtiquestion").append(`
                    <form class="ac-custom ac-radio ac-circle" autocomplete="off" style="display: ${display}">
                        <h2>${index + 1}.${item.question}</h2>
                        <ul>
                            <li>
                                <input id="choice_a" name="answer" value="${item.choice_a.value}" type="radio">
                                    <label for="choice_a">
                                        ${item.choice_a.text}
                                    </label>
                                    <svg viewBox="0 0 100 100"></svg>
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></li>
                            <li>
                                <input id="choice_b" name="answer" value="${item.choice_b.value}" type="radio">
                                    <label for="choice_b">
                                        ${item.choice_b.text}
                                    </label>
                                    <svg viewBox="0 0 100 100"></svg>
                            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"></svg></li>
                        </ul>
                    </form>`
                );
            })

            //等待页面渲染完成后插入 svgcheckbx.js
            $("body").append("<script src='./static/js/svgcheckbx.js'></script>");
        }
    });


    $("input[name='answer']").on("change", function () {
        var answer = $(this).val();
        answers.push(answer);

        var form = $(this).parent().parent().parent();
        var next_form = form.next();
        setTimeout(function () {
            form.remove();
            next_form.css("display", "block");
        }, 520);
        if (answers.length == 93) {
            var page = ObtainingAnswers(answers)

            window.location.href = `./personalities/${page}.html`;
            //$.ajax({
            //    type: 'post',
            //    url: 'http://localhost:64883/common/Update/SubmitMBTI.ashx',
            //    data: {
            //        "answers": JSON.stringify(answers),
            //        "result": page
            //    },
            //    async: false,
            //    error: function (XMLHttpRequest, textStatus, errorThrown) {
            //        alert("Request Failed!");
            //    },
            //    success: function (data) {
            //        if (data == "true") {
            //            window.location.href = `./personalities/${page}.html`;
            //        } else {
            //            alert(data)
            //        }
            //    }
            //})
        }

    })

    function ObtainingAnswers(answer_list) {
        // 检查答案列表是否为空
        if (answer_list.length === 0) {
            alert('ValueError', 'answer list is empty')
            return;
        }
        // 检查答案列表是否包含有效的类型
        const valid_types = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']
        answer_list.forEach((item) => {
            if (!valid_types.includes(item)) {
                alert('TypesError, answer type is not in types')
                return;
            }
        })
        // 使用 reduce 方法来统计每种类型的答案的个数
        const counts = answer_list.reduce((acc, cur) => {
            acc[cur] = (acc[cur] || 0) + 1
            return acc
        }, {})
        // 使用 get_result 函数来计算结果
        const types = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']]
        const result = types.map(t => counts[t[0]] > counts[t[1]] ? t[0] : t[1]).join('')

        return result
    }
});

