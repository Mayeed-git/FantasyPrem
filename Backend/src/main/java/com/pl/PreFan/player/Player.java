package com.pl.PreFan.player;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "player_statistics")
public class Player {
    @Id
    @Column(name = "player_name", unique = true)
    private String name;

    @Column(name = "nation")
    private String nation;

    @Column(name = "position")
    private String pos;

    @Column(name = "age")
    private Integer age;

    @Column(name = "matches_played")
    private Integer mp;

    @Column(name = "starts")
    private Integer starts;

    @Column(name = "minutes_played")
    private Float min;

    @Column(name = "goals")
    private Float gls;

    @Column(name = "assists")
    private Float ast;

    @Column(name = "penalties_scored")
    private Float pk;

    @Column(name = "yellow_cards")
    private Float crdy;

    @Column(name = "red_cards")
    private Float crdr;

    @Column(name = "expected_goals")
    private Float xg;

    @Column(name = "expected_assists")
    private Float xag;

    @Column(name = "team_name")
    private String team;

    public Player() {
    }

    public Player(String name, String nation, String pos, Integer age, Integer mp, Integer starts, Float min, Float gls, Float ast, Float pk, Float crdy, Float crdr, Float xg, Float xag, String team) {
        this.name = name;
        this.nation = nation;
        this.pos = pos;
        this.age = age;
        this.mp = mp;
        this.starts = starts;
        this.min = min;
        this.gls = gls;
        this.ast = ast;
        this.pk = pk;
        this.crdy = crdy;
        this.crdr = crdr;
        this.xg = xg;
        this.xag = xag;
        this.team = team;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNation() {
        return nation;
    }

    public void setNation(String nation) {
        this.nation = nation;
    }

    public String getPos() {
        return pos;
    }

    public void setPos(String pos) {
        this.pos = pos;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Integer getMp() {
        return mp;
    }

    public void setMp(Integer mp) {
        this.mp = mp;
    }

    public Integer getStarts() {
        return starts;
    }

    public void setStarts(Integer starts) {
        this.starts = starts;
    }

    public Float getMin() {
        return min;
    }

    public void setMin(Float min) {
        this.min = min;
    }

    public Float getGls() {
        return gls;
    }

    public void setGls(Float gls) {
        this.gls = gls;
    }

    public Float getAst() {
        return ast;
    }

    public void setAst(Float ast) {
        this.ast = ast;
    }

    public Float getPk() {
        return pk;
    }

    public void setPk(Float pk) {
        this.pk = pk;
    }

    public Float getCrdy() {
        return crdy;
    }

    public void setCrdy(Float crdy) {
        this.crdy = crdy;
    }

    public Float getCrdr() {
        return crdr;
    }

    public void setCrdr(Float crdr) {
        this.crdr = crdr;
    }

    public Float getXg() {
        return xg;
    }

    public void setXg(Float xg) {
        this.xg = xg;
    }

    public Float getXag() {
        return xag;
    }

    public void setXag(Float xag) {
        this.xag = xag;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }
}
